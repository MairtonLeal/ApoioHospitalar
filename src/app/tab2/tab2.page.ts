import { Keys } from './../core/Keys';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AlertController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import * as moment from 'moment';
import { of } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import {
  NavigationEnd,
  NavigationExtras,
  Router,
  RouterEvent,
} from '@angular/router';
import { ChatAtendimentoPage } from '../chat-atendimento/chat-atendimento.page';
import { DetailEstadiaPage } from '../detail-estadia/detail-estadia.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

// Esta tab será destinada a assinaturas segundo as informações propostas como acompanhamentos de hospitais
export class Tab2Page implements OnInit {
  confirmado: boolean = true;
  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.');
  carregando: any;
  meuServico: any;
  servicos: any;
  usuarioId: any;
  lembretes: any;
  planos: any;
  convites: any;
  meuUsuario: any;
  profSelecionado: any;
  statusPlano: any;
  idServico: any;
  conveniados: any;
  existeConvenio: any;
  meusConvites: any;
  profissionais: any;
  atendimentos: any;
  estadias: any;
  profdoAtendimento: any;
  infoVazia: any;
  telefone: any;
  public slideOpt = {
    slidesPerView: 2.8,
  };
  errorConexao = false;


  constructor(
    public alertController: AlertController,
    public route: Router,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private toastController: ToastService,
    private fbstore: AngularFirestore,
    private router: Router
  ) {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
  }
  ionViewWillEnter() {
    if (localStorage.getItem(Keys.userSollow) !== null) {
      this.usuarioId = localStorage.getItem(Keys.userSollow);
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }

  }

  async ngOnInit() {
    this.getProfissionais();
    this.getUsuario();
    this.getEstadia();
    // this.getAtendimento();
    // this.getServicosAgendados();
  }

  async getUsuario() {
    this.fbstore
      .collection('Idosos')
      .doc(this.usuarioId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.meuUsuario = singleDoc;
        this.telefone = this.meuUsuario.telefone;
      });
  }
  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      this.getProfissionais();
      this.getEstadia();
      // this.getAtendimento();

      this.carregando = false;
    }, 2000);
  }

  async getProfissionais() {
    this.carregando = true;
    this.fbstore
      .collection(`Profissionais`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.profissionais = data.map((lista: any) => {
          // console.log(lista.payload.doc.data());
          this.carregando = false;
          return {
            id: lista.payload.doc.id,
            foto: lista.payload.doc.data().fotoPerfil,
            nome: lista.payload.doc.data().nomeUser,
            profissao: lista.payload.doc.data().profissao,
          };
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }

  async getAtendimento() {
    this.carregando = true;
    const refAtendimento = this.fbstore.collection(`Atendimento`, (ref) =>
      ref.where('idCliente', '==', this.usuarioId)
    );
    refAtendimento.get().subscribe((data) => {
      if (data.empty) {
        this.infoVazia = true;
      } else {
        this.infoVazia = false;
        this.fbstore
          .collection(`Atendimento`, (ref) =>
            ref.where('idCliente', '==', this.usuarioId)
          )
          .snapshotChanges()
          .subscribe((data: any) => {
            this.atendimentos = data.map((lista: any) => {
              this.carregando = false;
              console.log(lista.payload.doc.data());
              // this.profdoAtendimento = lista.payload.doc.data().idSP;
              if (lista.payload.doc.data().statusAtendimento !== 'arquivado') {
              return {
                  id: lista.payload.doc.id,
                  criadoEm:lista.payload.doc.data().criadoEm,
                  dataHora: lista.payload.doc.data().dataHora,
                  cuidadoTipo: lista.payload.doc.data().tipoCuidado,
                  cuidadoAssis: lista.payload.doc.data().cuidadoAss,
                  profissao: lista.payload.doc.data().profissao,
                  profissional: lista.payload.doc.data().profissional,
                  endereco:lista.payload.doc.data().endereco,
                  status: lista.payload.doc.data().statusAtendimento,
                  obs: lista.payload.doc.data().obsIdoso,
                  foto: lista.payload.doc.data().fotoProfissional
                };
              } else {
                return null;
              }
            });
            of(data)
              .pipe(delay(1500))
              .subscribe(() => {
                this.carregando = false;
              });
          });

      }
    });
  }


  async cancelarAtendimento(id: any) {
    await this.fbstore
      .collection('Atendimento')
      .doc(id)
      .delete()
      .then(() => {
        this.toastController.showToast(
          'Atendimento cancelado com sucesso',
          2000,
          'success'
        );
        this.atualizarPagina();
      })
      .catch((error) => console.log(error));
  }

  async chatAtendimento(id: any) {
    const modal = await this.modalController.create({
      component: ChatAtendimentoPage,
      cssClass: 'my-custom-class',
      mode: 'ios',
      // swipeToClose: true,
      componentProps: {
        atendimentoId: id,
      },
    });

    // codigo para atualizar paginas ao fechar modal
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.getAtendimento();
      }
    });
    return await modal.present();
  }

  async detalhesEstadia(id: any){
    const modal = await this.modalController.create({
      component: DetailEstadiaPage,
      cssClass: 'modal-atendimento',
      componentProps: {
        atendimentoId: id,
        telefone: this.telefone
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.getEstadia();
        this.atualizarPagina();
      }
    });
    return await modal.present();
  }



 
  async getEstadia() {
    this.carregando = true;
    const refAtendimento = this.fbstore.collection(`Estadia`, (ref) =>
      ref.where('idCliente', '==', this.usuarioId)
    );
    refAtendimento.get().subscribe((data) => {
      if (data.empty) {
        this.infoVazia = true;
      } else {
        this.infoVazia = false;
        this.fbstore
          .collection('Estadia', (ref) =>
            ref.where('idCliente', '==', this.usuarioId)
          )
          .snapshotChanges()
          .subscribe((data: any) => {
            this.estadias = data.map((lista: any) => {
              this.carregando = false;
              // console.log(lista.payload.doc.data());
              // this.profdoAtendimento = lista.payload.doc.data().idSP;
              if (lista.payload.doc.data().statusEstadia !== 'arquivado') {
              return {
                  id: lista.payload.doc.id,
                  idProf: lista.payload.doc.data().idProfissional,
                  criadoEm:lista.payload.doc.data().criadoEm,
                  dataHora: lista.payload.doc.data().dataHora,
                  profissao: lista.payload.doc.data().profissao,
                  profissional: lista.payload.doc.data().profissional,
                  endereco:lista.payload.doc.data().endereco,
                  status: lista.payload.doc.data().statusEstadia,
                  foto: lista.payload.doc.data().fotoProfissional,
                  valor: lista.payload.doc.data().valorTotal,
                  estadia: lista.payload.doc.data().estadia,
                  informacoes: lista.payload.doc.data().informacoes,
                  nomeHospital: lista.payload.doc.data().nomeHospital,
                };
              } else {
                return null;
              }
            });
            of(data)
              .pipe(delay(1500))
              .subscribe(() => {
                this.carregando = false;
              });
          });

      }
    });
  }

  async avaliarProf(id: any, estadia: any) {
    const alert = await this.alertController.create({
      header: `Avaliar seu profissional`,
      cssClass: 'alert-class',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Regular',
          value: '1',
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Bom',
          value: '2',

        },
        {
          name: 'radio3',
          type: 'radio',
          label: 'Otimo',
          value: '3',

        },
        {
          name: 'radio4',
          type: 'radio',
          label: 'Excelente',
          value: '4',
        },

      ],
      buttons: [
       {
          text: 'Avaliar',
          cssClass: 'confirm-button-service2',
          handler: (data) => {
            // console.log(id);
            // this.loadingController.
            this.loadingShow().finally(() => {
              this.fbstore
                .doc(`Estadia/${estadia?.id}`)
                .update({
                  statusEstadia: 'Arquivado',
                })
                .then(() => {
                  this.fbstore.collection('Profissionais')
                  .doc(id).collection('Avaliacao').doc(estadia?.id).set({
                      idProfissional: id,
                      notaAvaliacao: data,
                      profissional: estadia.profissional,
                      estadia,
                      criadoEm: new Date().toLocaleString()
      
                  }).then(() => {
                    this.toastController.showToast(
                      'Avaliação realizada com sucesso',
                      2000,
                      'success'
                    );
                    
                  }).catch((error: any) => {
                    console.log(error);
                   
                  })
                })
                .catch((error) => {
                  console.log(error);
                  this.toastController.showToast(
                    'Erro ao avaliar sua estadia',
                    1000,
                    'danger'
                  );
                });
             
            });
            this.atualizarPagina();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service2',
        }
      ]
    });

    await alert.present();
  }

  async loadingShow(){
    const loading = await this.loadingController.create({
      message: "Carregando",
      duration: 1500, 
      spinner: 'crescent', 
      translucent: true,
      mode:'ios',
    });
     await loading.present();
  }

}
