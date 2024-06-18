import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { Keys } from '../core/Keys';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet !: IonRouterOutlet;

  loginForm = new FormGroup({
    useremail: new FormControl('', [Validators.required, Validators.email]),
    userpass: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  button = false;
  mostrarSenha = true;
  idSendUser: any;

  constructor(
    public router: Router,
    private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    private toastservice: ToastService,
    private navController: NavController,
    private platform: Platform,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
    });

  }
  ionViewWillEnter() {
    this.idSendUser = localStorage.getItem(Keys.playerId);
    if (localStorage.getItem(Keys.userSollow) !== null) {
      this.navController.navigateRoot(['/tabs/tab1']);
    }
  }

  ngOnInit() {}

  async doLogin() {
    try {
      this.button = true;
      let email = this.loginForm.get('useremail')?.value as string;
      let senha = this.loginForm.get('userpass')?.value as string
      await this.fbauth
        .signInWithEmailAndPassword(
          email, senha
        )
        .then((data: any) => {
          // data.user.getIdToken().then((token) => {
          //   localStorage.setItem(Keys.user, JSON.stringify(data.user)); // salvar o usuario no localstorage
          // });
          // salvar o usuario no localstorage
          localStorage.setItem(Keys.userSollow, data.user.uid); // salvar o token no localstorage
          console.log(this.idSendUser);
          if(this.idSendUser) { 
            this.fbstore
            .collection('Idosos')
            .doc(data.user.uid)
            .update({
              playerId: this.idSendUser,
            })
            .then(() => {
            console.log('success');
              localStorage.setItem(Keys.userSollow, data.user.uid);
            })
            .catch(error => {
              console.log('error: ', error);
            })
          }
          // this.router.navigate(['/tabs/tab1']);
          this.navController.navigateRoot(['/tabs/tab1']);
          this.button = false;
        });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/wrong-password':
          this.toastservice.showToast(
            'Usuário ou senha está incorreta',
            2000,
            'danger'
          );
          this.button = false;
          break;
        case 'auth/user-not-found':
          this.button = false;
          this.toastservice.showToast(
            'Usuario não encontrado ou não existe',
            2000,
            'danger'
          );
          break;
        case 'auth/network-request-failed':
          this.button = false;
          this.toastservice.showToast(
            'Verifique sua conexão internet',
            2000,
            'danger'
          );
          break;
        default:
          this.toastservice.showToast(
            'Ocorreu um erro tente novamente',
            2000,
            'danger'
          );
      }
    }
  }

  async reset() {
    await this.router.navigate(['/esqueci-senha']);
  }
}
