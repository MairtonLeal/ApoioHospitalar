import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private toastobj: any;
  constructor(public alertController: AlertController, public toastController: ToastController) { }

  async alertaInformativo(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      cssClass: 'alert-show',
      buttons: [
        {
          text: 'Entendi',
          cssClass: 'alert-button-confirm',
        },
      ]
    });

    await alert.present();
  }

  alertClose(){
    this.alertController.dismiss();
  }

  async basicAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      cssClass: 'alert-basic',
      buttons: [
        {
          text: 'Entendi',
          cssClass: 'alert-basic-confirm',
        },
      ]
    });

    await alert.present();
  }

  async alertWithFunction(header: string, subHeader: string, message: string, textButton: string, handle?: () => void) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      cssClass: 'alert-basic',
      buttons: [
        {
          text: textButton,
          cssClass: 'alert-basic-confirm',
          handler: handle
        },
      ]
    });

    await alert.present();
  }




  async alertCancelWithFunction(header: string, subHeader: string,
     message: string, textButton: string, handle?: () => void,
     handleCancel?: () => void
     ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      cssClass: 'alert-confirm',
      buttons: [
        {
          text: "Cancelar",
          cssClass: 'cancel-button-service',
          role:'cancel',
          handler: handleCancel
        },
        {
          text: textButton,
          cssClass: 'confirm-button-service',
          handler: handle
        },
      ]
    });

    await alert.present();
  }

  async showToastinfo(icon:any, toastmsg: any, cor: any) {
    this.toastobj = this.toastController.create({
      icon,
      message: toastmsg,
      duration: 1500,
      color: cor,
      position:'top',
      mode:'ios',
    }).then((toastData) => {
      toastData.present();
    });
  }

  async showToastSuccess(toastmsg: any,) {
    this.toastobj = this.toastController.create({
      message: toastmsg,
      duration: 2000,
      color: 'success',
      position:'top',
    }).then((toastData) => {
      toastData.present();
    });
  }

  hideToast() {
    this.toastobj = this.toastController.dismiss();
  }


}
