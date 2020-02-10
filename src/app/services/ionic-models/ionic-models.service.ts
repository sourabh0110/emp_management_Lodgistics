import { Injectable } from '@angular/core';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IonicModelsService {

  constructor(private loadingController:LoadingController,private alertController:AlertController) { }

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

}
