import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { ToastService } from './../services/toast.service';
import { Keys } from './../core/Keys';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import * as moment from 'moment';
import { SelecionarProfPage } from '../selecionar-prof/selecionar-prof.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  dateToday = moment().locale('pt-br').format('D MMMM, YYYY - HH:mm');
  carregando: any;
  nome = '';
  foto: any;
  usuario: any;
  usuarioData: any;
  profissionais: any;
  lembretes: any;
  usuarioId: any;
  meuServico: any;
  servicos: any;
  verificaServico: any;
  infoVazia!: boolean;
  servicoNulo!: boolean;
  contadorServicos = 0;
  errorConexao = false;

  // dadosUsuario = [];

  constructor(
    public router: Router,
    private fbstore: AngularFirestore,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toastService: ToastService
  ) {}

  ionViewWillEnter() {
    if (localStorage.getItem(Keys.userSollow) !== null) {
      this.usuarioId = localStorage.getItem(Keys.userSollow);
      this.router.navigate(['/tabs/tab1']);
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    this.getUsuario();
    this.getProfissionais();
    // this.getServicosAgendados();

  }

  async ngOnInit() {
  }

 

  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      if (localStorage.getItem(Keys.userSollow) !== null) {
        this.getUsuario();
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      // this.getLembretes();
      this.carregando = false;
    }, 2000);
  }

  async goProf(profissionalSelecionado: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        profissionalId: profissionalSelecionado.id,
      },
    };
    await this.router.navigate(['/profile-prof'], navigationExtras);
  }

  async getUsuario() {
     this.fbstore
      .collection(`Idosos`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.usuario = data.map((meusDados: any) => {
          this.carregando = false;
          if (this.usuarioId === meusDados.payload.doc.id) {
            this.foto = meusDados.payload.doc.data().fotoPerfil;
            this.nome = meusDados.payload.doc.data().nomeResp;
            this.usuarioData = meusDados.payload.doc.data();
            return {
              email: meusDados.payload.doc.data().email,
              foto: meusDados.payload.doc.data().fotoPerfil,
              nomeIdoso: meusDados.payload.doc.data().nomeIdoso,
              nomeResp: meusDados.payload.doc.data().nomeResp,
              telefone: meusDados.payload.doc.data().telefone,
              gs: meusDados.payload.doc.data().gs,
              peso: meusDados.payload.doc.data().peso,
              temperatura: meusDados.payload.doc.data().temperatura,
              batimentos: meusDados.payload.doc.data().batimentos,
              pressaoArterial: meusDados.payload.doc.data().pressaoArterial,
            };
          }
        });
        // of(data)
        //   .pipe(delay(1500))
        //   .subscribe(() => {
        //     this.carregando = false;
        //   })
        of([1, 2, 3]).subscribe({
          next: (v) => null,
          error: (e) => console.error('erro de: ', e),
          complete: () => {
            this.carregando = false;
          },
        });
        // of(Error)
        // .pipe(delay(1500))
        // .subscribe(() => {
        //   this.carregando = false;
        // })
      });
  }

  async getProfissionais() {
    this.carregando = true;
    this.fbstore
      .collection(`Profissionais`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.profissionais = data.map((lista: any) => {
          this.carregando = false;
          return {
            id: lista.payload.doc.id,
            foto: lista.payload.doc.data().fotoPerfil,
            nome: lista.payload.doc.data().nomeUser,
            profissao: lista.payload.doc.data().profissao,
            playerId: lista.payload.doc.data().playerId,
          };
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando aguarde...',
      duration: 1500,
    });
    await loading.present();
  }

  
  // async verAvaliacoes() {
  //   const modal = await this.modalController.create({
  //     component: AvaliacoesPage,
  //     cssClass: 'modal-atendimento',
  //     mode: 'ios',
  //     swipeToClose: true,
  //   });
  //   return await modal.present();
  // }

  async escolherTipoServico(profissionalSelecionado: any) {
    const modal = await this.modalController.create({
      component: SelecionarProfPage,
      cssClass: 'modal-atendimento',
      mode: 'ios',
      // swipeToClose: true,
      componentProps: {
        profissionalSelecionado: profissionalSelecionado,
      },
    });
    return await modal.present();
  }

  async selecionarGS(){
    const alert = await this.alertController.create({
      header: 'Informe seu tipo sanguineo',
      message: 'Esta opção será somente visualizada por você',
      inputs: [
        {
          label: 'AB+',
          type: 'radio',
          value: 'AB+',
        },
        {
          label: 'AB-',
          type: 'radio',
          value: 'AB-',
        },
        {
          label: 'A-',
          type: 'radio',
          value: 'A-',
        },
        {
          label: 'A+',
          type: 'radio',
          value: 'A+',
        },
        {
          label: 'O+',
          type: 'radio',
          value: 'O+',
        },
        {
          label: 'O-',
          type: 'radio',
          value: 'O-',
        },
       
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',

          handler: () => {
          
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'confirm-button-service',
          handler: (data:string) => {
            console.log('Alert confirmed', data);
            this.usuario.gs = data;
            this.fbstore.doc('Idosos/'+this.usuarioId).update({
              gs: this.usuario.gs
            }).then(() => {
              this.toastService.showToast('Grupo sanguineo com sucesso', 1000, 'success');
              }).catch(error => {
                console.log(error);
                this.toastService.showToast('Erro ao atualizar', 1000, 'danger')});
          },
        },
      ],
    
    });

    await alert.present();
  }

  async informar(tipo: string) {
    let title = '';
  
    switch (tipo) {
      case 'peso':
        title = 'Informe seu peso atual';
        break;
      case 'temperatura':
        title = 'Informe sua temperatura atual';
        break;
      case 'pressao':
        title = 'Informe sua pressão atual';
        break;
      case 'batimentos':
        title = 'Informe seus batimentos';
        break;
      default:
        return; // Tipo inválido
    }
  
    const alert = await this.alertController.create({
      header: title,
      message: 'Seu valor será sempre atualizado no serviço ou aqui',
      inputs: [
        {
          type: 'tel',
          placeholder: 'Valor',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',
          handler: () => {}
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'confirm-button-service',
          handler: (data: string) => {
            console.log('Alert confirmed', data[0]);
            const updateData = {} as any;
            updateData[tipo] = data[0];
            this.fbstore.doc(`Idosos/${this.usuarioId}`).update(updateData)
              .then(() => {
                this.toastService.showToast('Valor atualizado com sucesso', 1000, 'success');
              })
              .catch(error => {
                console.log(error);
                this.toastService.showToast('Erro ao atualizar', 1000, 'danger');
              });
          }
        },
      ],
    });
  
    alert.present();
  }


}
