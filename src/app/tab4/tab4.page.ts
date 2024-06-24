import { Keys } from './../core/Keys';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.');
  phoneNumber = '';
  email = '';
  nome: any;
  foto = '';
  usuario: any;
  usuarioId !: any;
  meuPerfil: any;
  meuId: any;
  constructor(
    private fbauth: AngularFireAuth,
    public router: Router,
    private fbstore: AngularFirestore,
    public alertController: AlertController,

  ) {

  }

  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    if (localStorage.getItem(Keys.userSollow) !== null) {
      this.usuarioId = localStorage.getItem(Keys.userSollow);
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }

  }

  ngOnInit(): void {
  }

  async sair() {

    await this.fbauth
      .signOut()
      .then(() => {
        localStorage.removeItem(Keys.userSollow);
        localStorage.removeItem(Keys.token);
        localStorage.removeItem(Keys.playerId);
        this.router.navigate(['/login']);

      })
      .catch((error) => console.log(error));
  }

  async getProfile() {
    //  Função para pegar dados diretamente do auth do usuário
    this.fbauth.authState.subscribe((data) => {
      if (data && data.email && data.uid) {
        this.email = data.email;
        this.nome = data.displayName;
      } else {
        console.log('Não foi possível autenticar.');
      }
    });
  }

 

  async atualizarDados() {
    let navigationExtras: NavigationExtras = {
      state: {
        idPerfil: this.meuId,
      },
    };
    await this.router.navigate(['/profile-user'], navigationExtras);
  }

  async historico() {
    await this.router.navigate(['/historico']);
  }
  async entrarEmContato(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Suporte e informações',
      subHeader: 'Sugestões, Elogios e Reclamações',
      message: 'Mande um email para Entraremos em contato assim que possivel',
      buttons: ['Fechar']
    });

    await alert.present();
  }
}
