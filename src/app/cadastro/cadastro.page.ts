import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import {  LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';
import { Keys } from '../core/Keys';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  termos = false;
  mostrarSenha = true;
  nameResp = '';
  nomeIdoso = '';
  age: number | undefined;
  idadeIdoso: number | undefined;
  telefone = '';
  button = false;
  uploadProgress: Observable<number> | undefined;
  verFoto = '';
  exibirFoto: any;
  idDoc: any;
  sobreIdoso: any;
  idSendUser: any;
  signupform = new FormGroup({
    useremail: new FormControl('', [Validators.required, Validators.email]),
    userpass: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    public router: Router,
    private fbstore: AngularFirestore,
    private toastservice: ToastService,
    private afStorage: AngularFireStorage,
    private fbauth: AngularFireAuth,
    private imagePicker: ImagePicker,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
  this.idSendUser = localStorage.getItem(Keys.playerId);
  }

  async finish() {}
  async doSignup() {
    if (!this.signupform.get('useremail')?.value) {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha os campo Email ',
        2000,
        'danger'
      );
    }
    if (!this.signupform.get('userpass')?.value) {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o campo Senha',
        2000,
        'danger'
      );
    }
    if (this.nameResp === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o campo Nome do responsável',
        2000,
        'danger'
      );
    }
    // if (this.nomeIdoso === '') {
    //   this.toastservice.showToast(
    //     'Erro ao Cadastrar, Preencha o campo Telefone',
    //     2000,
    //     'danger'
    //   );
    // }
    // if (this.idadeIdoso === undefined) {
    //   this.toastservice.showToast(
    //     'Erro ao Cadastrar, Idade do idoso',
    //     2000,
    //     'danger'
    //   );
    // }
    if (this.telefone === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o campo Telefone',
        2000,
        'danger'
      );
    } else {

      try {
        const email = this.signupform.get('useremail')?.value as string;
        const senha = this.signupform.get('userpass')?.value as string;
        this.button = true;
        if(this.exibirFoto){
          const loading = await this.loadingController.create({
            message: 'Cadastrando usuário ...',
          });
          loading.present();
          await this.fbauth
          .createUserWithEmailAndPassword(email, senha)
          .then((data: any) => {
            data.user.updateProfile({
              displayName: this.nameResp,
            });
            this.idDoc = data.user.uid;
            // const randomId = Math.random().toString(36).substring(2);
            const ref = this.afStorage.ref(this.idDoc );
            const task = ref.put(
              this.dataURItoBlob(this.exibirFoto)
            );
            this.uploadProgress = task
              .snapshotChanges()
              .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
            task.then((res: any) => {
              ref
                .getDownloadURL()
                .toPromise()
                .then((result: string) => {
                  // this.cliente.usuario.foto = result;
                  // this.uploadProgress = null;
                  // this.atualizado().then();
                  this.verFoto = result;
                  this.fbstore
                  .collection('Idosos')
                  .doc(this.idDoc)
                  .set({
                    email: this.signupform.get('useremail')?.value,
                    telefone: this.telefone,
                    nomeResp: this.nameResp,
                    // nomeIdoso: this.nomeIdoso,
                    // idadeIdoso: this.idadeIdoso,
                    // sobreIdoso: this.sobreIdoso, 
                    fotoPerfil: this.verFoto,
                    playerId: this.idSendUser
                  })
                  .then(() => {
                    this.router.navigate(['/tabs/tab1']);
                    loading.dismiss()
                    this.button = false;
                    localStorage.setItem(Keys.userSollow, this.idDoc);
                  });
                });
            });
          
            // .then((result) => {
            //   localStorage.setItem(Keys.token, result.id);
            //   console.log(result.id);
            // });
          });
        } else {
          this.toastservice.showToast(
            'Erro ao Cadastrar, coloque a foto',
            2000,
            'danger'
          );
          this.button = false;
        }
      } catch (error: any) {
        switch (error.code) {
          case 'auth/invalid-email':
            this.toastservice.showToast('Email invalido', 2000, 'danger');
            break;
          default:
            this.toastservice.showToast(
              'Erro ao Cadastrar, tente novamente',
              2000,
              'danger'
            );
            console.log(error.message);
        }
      }
    }
  }

  fotoPerfil(): void {
    this.imagePicker
      .getPictures({
        quality: 100,
        maximumImagesCount: 1,
        title: 'Selecionar foto',
        outputType: 1, // base64
      })
      .then(
        (results) => {
          this.exibirFoto = 'data:image/png;base64,' + results[0];
          // const randomId = Math.random().toString(36).substring(2);
          // const ref = this.afStorage.ref(randomId);
          // const task = ref.put(
          //   this.dataURItoBlob('data:image/png;base64,' + results[0])
          // );
          // this.uploadProgress = task
          //   .snapshotChanges()
          //   .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
          // task.then((res: any) => {
          //   ref
          //     .getDownloadURL()
          //     .toPromise()
          //     .then((result: string) => {
          //       // this.cliente.usuario.foto = result;
          //       this.verFoto = result;
          //       // this.uploadProgress = null;
          //       // this.atualizado().then();
          //     });
          // });
        },
        (err) => {
          // alert('Camera não habilitada');
          this.toastservice.showToast(
            'Erro ao tirar foto, tente novamente',
            2000,
            'danger'
          );
          console.log(err);
        }
      );
  }

  private dataURItoBlob(dataURI: string) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}