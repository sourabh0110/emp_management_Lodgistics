import { Injectable } from '@angular/core';
import { LoadingController, ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { NativeServiceService } from '../native-service/native-service.service';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class IonicModelsService {

  constructor(private platform:Platform, private nativeService:NativeServiceService, private loadingController:LoadingController,private alertController:AlertController,private actionSheetController:ActionSheetController ) { }

  async showLoader(message){
    const loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }

  async hideLoader(){
    setTimeout(async ()=>{
      await this.loadingController.dismiss();
    },500)
    
  }

  async presentAlertConfirm() {
    return new Promise( async (resolve,reject)=>{
      const alert = await this.alertController.create({
        header: 'Delete Record!',
        message: '<strong> Are you sure?</strong>',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              reject();
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              resolve();
            }
          }
        ]
      });
  
      await alert.present();
    })
   
  }
  showAlert(title: string, msg: string, buttonTitle: any) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: title,
        subHeader: msg,
       //  enableBackdropDismiss: false,
        buttons: [
          {
            text: (buttonTitle),
            handler: () => {
              resolve("");
            }
          }
        ]
      });
      alert.present();
    })
  }

   selectImage() {
    return new Promise(async(resolve,reject)=>{
      let cameraProperties = AppConfig.cameraProperties;
      let quality;
      if (this.platform.is("ios")) {
        quality = cameraProperties.iosquality;
      }
      else {
        quality = cameraProperties.androidquality;
      }
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.nativeService.takePicture(cameraProperties.destinationType.FILEURI, cameraProperties.sourceType.CAMERA, cameraProperties.encoding.PNG, cameraProperties.imageSize, quality).then(img => {
              resolve(img);
             }, err => {  
               console.log(err);
               reject(err);
              // this.isUnloading = true;
             })
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.nativeService.takePicture(cameraProperties.destinationType.FILEURI, cameraProperties.sourceType.SAVEDPHOTOALBUM, cameraProperties.encoding.PNG, cameraProperties.imageSize, quality).then(img => {
              resolve(img);
             }, err => {  
               console.log(err);
               reject(err);
              // this.isUnloading = true;
             })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    })
    
  }

}
