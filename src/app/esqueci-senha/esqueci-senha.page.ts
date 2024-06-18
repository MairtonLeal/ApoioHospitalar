import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
})
export class EsqueciSenhaPage implements OnInit {

  email: any;
  constructor( public alertController: AlertController, private toastservice: ToastService,  private fbauth: AngularFireAuth,) { }

  ngOnInit() {
  }
  async alertSenha(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseja confirmar esta ação',
      message: 'Enviaremos um link para resetar sua senha.',
      mode:'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            console.log('Confirm Ok' );
            this.resetarSenha();
            // this.fbauth.sendPasswordResetEmail();
          }
        }
      ]
    });

    await alert.present();
  }

 async resetarSenha(){
    this.fbauth.sendPasswordResetEmail(this.email).then((result: any) => {
      console.log(result);
      this.toastservice.showToast('Solicitação de alteração de senha com sucesso',2000,'success');
    }
    ).catch(error => {
      console.log(error);
      this.toastservice.showToast('Email inválido ou não existe',2000,'danger');});
}

}
