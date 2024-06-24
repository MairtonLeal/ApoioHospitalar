import { ToastService } from './../services/toast.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Keys } from '../core/Keys';
import { map } from 'rxjs/operators';
import { AlertService } from '../core/services/alertService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
})
export class ProfileUserPage implements OnInit {
  uploadProgress!: Observable<number>;
  exibirFoto: any;
  verFoto: any;
  telefone: any;
  meuUsuario: any;
  meuId: any;
  button = false;
  nomeUsuario = '';
  nomePaciente = '';
  emailUsuario = '';
  contatoUsuario = '';

  constructor(private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastService,
    private alertService: AlertService
  ) {
    this.meuId = localStorage.getItem(Keys.userSollow);
    this.getUsuario();
  }

  ngOnInit() {
  }

  async getUsuario() {
    try {
      this.fbstore
        .collection(`Idosos`)
        .doc(this.meuId)
        .valueChanges()
        .subscribe(res => {
          console.log(res);
          this.meuUsuario = res;
          this.emailUsuario = this.meuUsuario.email;
          this.nomeUsuario = this.meuUsuario.nomeResp;
          this.nomePaciente = this.meuUsuario.nomeIdoso;
          this.contatoUsuario = this.meuUsuario.telefone
          this.exibirFoto = this.meuUsuario?.fotoProfile
        })
    } catch (error) {
      this.toastController.showToast('Erro ao receber dados', 1000, 'danger');

    }

  }

  async fotoPerfil() {
    console.log('clicou aqui');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.exibirFoto = image.dataUrl;


    // this.imagePicker
    //   .getPictures({
    //     quality: 100,
    //     maximumImagesCount: 1,
    //     title: 'Selecionar foto',
    //     outputType: 1, // base64
    //   })
    //   .then(
    //     (results) => {
    //       let randomId: any;
    //       this.exibirFoto = 'data:image/png;base64,' + results[0];
    //       randomId = localStorage.getItem(Keys.token);
    //       const ref = this.afStorage.ref(randomId);
    //       const task = ref.put(
    //         this.dataURItoBlob(this.exibirFoto)
    //       );
    //       // aqui faz upload
    //       this.uploadProgress = task
    //         .snapshotChanges()
    //         .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
    //       task.then((res) => {
    //         ref.getDownloadURL().toPromise().then((result) => {
    //               this.meuUsuario.foto = result;
    //             // this.uploadProgress = null;
    //           });
    //       });
    //     },
    //     (err) => {
    //       alert(err);
    //     }
    //   );
  }

  private dataURItoBlob(dataURI: any) {
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


  async atualizarPerfil() {
    this.button = true;
    if (this.exibirFoto) {
      let dadosUsuario = {
        email: this.emailUsuario,
        nomeResp: this.nomeUsuario,
        nomeIdoso: this.nomePaciente,
        telefone: this.contatoUsuario,
        fotoProfile: this.meuUsuario.foto
      }

      await this.alertService.alertCancelWithFunction(
        "Atualizar Perfil?", "", "Para confirmar esta ação clique em confirmar", "Confirmar", () => {
          let randomId: any;
          randomId = localStorage.getItem(Keys.token);
          const ref = this.afStorage.ref(randomId);
          const task = ref.put(
            this.dataURItoBlob(this.exibirFoto)
          );
          // aqui faz upload
          this.uploadProgress = task
            .snapshotChanges()
            .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
          task.then((res) => {
            ref.getDownloadURL().toPromise().then((result) => {
              this.meuUsuario.fotoPerfil = result;
              this.fbstore.doc('Idosos/' + this.meuId).update(dadosUsuario).then(() => {
                this.toastController.showToast('Perfil atualizado com sucesso', 1000, 'success');
                this.button = false;
                this.router.navigate(['/tabs/tab4']);
              }).catch(error => {
                // console.log(error);
                this.toastController.showToast('Erro ao atualizar', 1000, 'danger')
              });
            });
          });

        },
      )
    } else {
      let dadosUsuario = {
        email: this.emailUsuario,
        nomeResp: this.nomeUsuario,
        nomeIdoso: this.nomePaciente,
        telefone: this.contatoUsuario,
        fotoProfile: ''
      }

      await this.alertService.alertCancelWithFunction(
        "Atualizar Perfil?", "", "Para confirmar esta ação clique em confirmar", "Confirmar", () => {
          this.fbstore.doc('Idosos/' + this.meuId).update(dadosUsuario).then(() => {
            this.toastController.showToast('Perfil atualizado com sucesso', 1000, 'success');
            this.button = false;
            this.router.navigate(['/tabs/tab4']);
          }).catch(error => {
            // console.log(error);
            this.toastController.showToast('Erro ao atualizar', 1000, 'danger')
          });
        });

    }

  }

}
