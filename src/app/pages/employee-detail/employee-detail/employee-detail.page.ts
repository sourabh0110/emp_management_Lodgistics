declare var window:any;
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModelsService } from 'src/app/services/ionic-models/ionic-models.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppConfig } from 'src/app/services/app-config';
import { Platform, NavController } from '@ionic/angular';
import { NativeServiceService } from 'src/app/services/native-service/native-service.service';
import { UtilityService } from 'src/app/services/util-service/utility.service';
import { OfflineService } from 'src/app/services/offline-service/offline.service';



@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit {
  employee: any = {};
  /**
   * Form to manage document
   */
  /**
   * Employee form 
   */
  empForm: any;
  /**
   * Check for validation
   */
  submitAttempt: boolean;
  /**
   * Index 
   */
  index:any;
  /**
   * Employee list
   */
  empList:any=[];
  constructor(private navCtrl:NavController, private offlineService:OfflineService, private webview: WebView, private util: UtilityService, private nativeService: NativeServiceService, private platform: Platform, private formbuilder: FormBuilder, private ionicModels: IonicModelsService, private route: ActivatedRoute,
    public router: Router) {
    //Calling the function to set data
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.employee = this.router.getCurrentNavigation().extras.state.employee;
        this.index = this.router.getCurrentNavigation().extras.state.index;
        console.log(this.employee);
        console.log(this.index);
        this.initForm();
      }
    });
  }

  ngOnInit() {
     this.offlineService.getValues('emp').then(res=>{
      this.empList = res;
    });
  }
  /**
   * Initialise the form
   */
  initForm() {
    this.empForm = this.formbuilder.group({
      employee_name: [this.employee.employee_name || "", Validators.compose([Validators.required])],
      employee_salary: [this.employee.employee_salary || "", Validators.compose([Validators.required])],
      employee_age: [this.employee.employee_age || "", Validators.compose([Validators.required])],
      id: new FormControl({ value: this.employee.id || '', disabled: true }, Validators.required)
    })
  }

  /**
   * To save form
   * @param empForm Form to save
   * @param isValid Check validation
   */
  saveEmp(empForm, isValid) {
    console.log(empForm);
    let error = this.findInvalidControls();
    console.log(error);
    this.submitAttempt = true;
    let id;
    if (!isValid) {
      this.ionicModels.showAlert("Error", "Fill all form fields", "ok")
    }
    else {
      this.ionicModels.showLoader('Saving Form..');
      //Update offline
      this.updateEmp(empForm);
      //Maybe calling image service
      this.ionicModels.hideLoader();


    }
  }
  /**
   * To update values
   * @param empForm update employee
   */
  updateEmp(empForm){
    empForm.id=this.employee.id;
    this.empList[this.index]=empForm;
    console.log(this.empList);
    this.offlineService.setValues('emp',this.empList);
    this.navCtrl.navigateRoot('') ;
  }
  /**
   * Find if there are any invalid controls
   */
  findInvalidControls() {
    const invalid = [];
    const controls = this.empForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  /**
   * Take Image Controller
   */
  takeImage() {

    this.ionicModels.selectImage().then((res: any) => {
      console.log(res);
      this.afterImageCapture(res, false);
    });

  }
  /**
   * To create local file image url and thumbnail 
   * @param img img returned
   * @param copy copy or move
   */
  afterImageCapture(img, copy) {
    let itemSrc;
    if (this.platform.is('ios')) {
      itemSrc = img.replace(/^file:\/\//, '');
      console.log("restore protocol" + itemSrc);
      let newImg = this.webview.convertFileSrc(itemSrc);
      console.log('Default nomalize' + newImg);
      var workingPath = window.Ionic.normalizeURL(newImg);
      console.log("workingPath " + workingPath);
      window.resolveLocalFileSystemURL(img).then(fileEntry => {
        console.log("got file: " + fileEntry.fullPath);
        console.log('cdvfile URI: ' + fileEntry.toInternalURL());
      })
      img = workingPath;
    }
    console.log('afterImageCapture', img);
    let newFileName = (new Date().getTime()) + ".png";
    let fileName = img.split("/").pop();
    let oldFilePath = img.replace(fileName, "");
    if (copy) {
      this.nativeService.copyFile(oldFilePath, AppConfig.directory.image, fileName, newFileName).then((imgUrl) => {
        console.log("afterImageCapture", imgUrl)
        this.createThumbnail(imgUrl);
      }, err => {
        console.log(err);
       
      });
    }
    else {
      this.nativeService.moveFile(oldFilePath, AppConfig.directory.image, fileName, newFileName).then((imgUrl:any) => {
        console.log("afterImageCapture move", imgUrl);
      //  this.createThumbnail(imgUrl, newFileName);
        let thumbPro = AppConfig.imageThumbnail;
        let thumbName = "thumb-" +(new Date().getTime()) + ".png";
        let mime_type = AppConfig.mediaFormats.imagePng.contentType;
        imgUrl=this.webview.convertFileSrc(imgUrl);
        this.util.makeThumbnail(imgUrl, thumbPro.height, thumbPro.width, thumbPro.quality, mime_type).then((blob) => {
          console.log(blob);
          this.nativeService.writeBlobFile(AppConfig.directory.image, thumbName, blob).then((url) => {
            this.onImageStore(imgUrl, url);
          }, err => {
            console.log(err);
          
          })
        }, err => {
          console.log(err);
         
        });
      }, err => {
        console.log(err);
     
      });
    }
  }
  /**
   * To store image in employee.profile_image
   * @param imgUrl Image
   * @param thumbnailUrl Thumbail 
   */
  onImageStore(imgUrl, thumbnailUrl) {
    console.log("onImageStore", imgUrl, thumbnailUrl);
    let image = {
      "fileUrl": imgUrl,
      "thumbnailUrl": thumbnailUrl,
    }
    this.employee.profile_image=image;
    console.log(this.employee);

    this.setImageOffline(this.employee);

    if (this.platform.is('ios')) {
      image.thumbnailUrl = window.Ionic.normalizeURL(image.thumbnailUrl);
      console.log(image);
    }
    // this.ims.hidePreloader();
    // this.isUnloading = true;
  }
  /**
   * To set offline data
   * @param employee employee value to update
   */
  setImageOffline(employee){
    this.empList[this.index]=employee;
    this.offlineService.setValues('emp',this.empList)
  }
  /**
   * To create thumbnail
   * @param imgUrl image url
   */
  createThumbnail(imgUrl) {
      var cdvUrl;
      let thumbName = "thumb-" +(new Date().getTime()) + ".png";
      let thumbPro = AppConfig.imageThumbnail;
      let mime_type = AppConfig.mediaFormats.imagePng.contentType;
      window.Ionic.WebView.convertFileSrc(imgUrl, function success(fileEntry) {
        console.log("got file: " + fileEntry.fullPath);
        cdvUrl = fileEntry.toInternalURL();
        imgUrl = cdvUrl;
        console.log('cdvfile URI: ' + fileEntry.toInternalURL());
        //imgUrl=window.Ionic.normalizeURL(imgUrl);
      }, err => {
        console.log(err);
      });
  
      if (this.platform.is('ios')) {
        imgUrl = imgUrl.replace(/^file:\/\//, '');
      }
      //Make a thumbnail of the image
      this.util.makeThumbnail(imgUrl, thumbPro.height, thumbPro.width, thumbPro.quality, mime_type).then((blob) => {
        console.log(blob);
        this.nativeService.writeBlobFile(AppConfig.directory.image, thumbName, blob).then((url) => {
          this.onImageStore(imgUrl, url);
        }, err => {
          console.log(err);
        
        })
      }, err => {
        console.log(err);
       
      });
  }

}
