import { Injectable } from '@angular/core';
import { LoadingController, ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { NativeServiceService } from '../native-service/native-service.service';
import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class IonicModelsService {

  constructor(private platform:Platform, private nativeService:NativeServiceService, private loadingController:LoadingController,private alertController:AlertController,private actionSheetController:ActionSheetController ) { }
  /**
   * To show loader
   * @param message Message to show
   */
  async showLoader(message){
    const loading = await this.loadingController.create({
      message: message
    });
    await loading.present();
  }
  /**
   * To hide loader
   */
  async hideLoader(){
    setTimeout(async ()=>{
      await this.loadingController.dismiss();
    },500)
    
  }
  /**
   * To show alert confirm
   */
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
  /**
   * To show Alert
   * @param title Title
   * @param msg Message
   * @param buttonTitle Button Text 
   */
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
    /**
     * To select type of image (click/gallery)
     */
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
          text: 'Use Camera',
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
          text: 'Load from Library',
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