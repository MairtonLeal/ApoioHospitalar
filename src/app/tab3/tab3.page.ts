import { Keys } from './../core/Keys';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import {
  AlertController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import * as moment from 'moment';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  carregando: any;
  meuServico: any;
  servicos: any;
  usuarioId: any;
  expandedIcon = true;
  expandedService = false;
  lembretes: any;
  evolucoes: any;

  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.')
  constructor(
    public alertController: AlertController,
    private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    private toastController: ToastService,
    public loadingController: LoadingController,
  ) {}
  
  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    this.getLembretes();
    this.getEvolucoes();
  }


  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      this.getLembretes();
      this.getEvolucoes();
      this.carregando = false;
    }, 2000);
  }

  // Rest para lembretes
  async addLembrete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registrar Lembrete',

      mode: 'ios',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome do Rémedio',
        },
        // {
        //   name: 'tipo',
        //   type: 'text',
        //   placeholder: 'Ex: comprimido, dosagem',
        // },
        // multiline input.
        {
          name: 'descricao',
          type: 'textarea',
          placeholder: 'Descrição, comprimido de Seg à Sexta',
        },
        // input date with min & max
        {
          name: 'horario',
          type: 'time',
          label: 'Horario',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Adicionar',
          handler: async (alertData) => {
            const loading = await this.loadingController.create({
              cssClass: 'my-custom-class',
              message: 'Carregando aguarde...',
              duration: 1500,
              spinner: 'crescent',
            });

            const idRandom = Math.floor(Math.random() * 1000) + this.usuarioId;
            await this.fbstore
              .collection('Lembretes')
              .doc(idRandom)
              .set({
                pertenceA: this.usuarioId,
                nome: alertData.nome,
                horario: alertData.horario,
                descricao: alertData.descricao,
                criadoEm: this.dateToday,
              })
              .then(() => {
                loading.present();
                this.toastController.showToast(
                  'Lembrete adicionado com sucesso',
                  2000,
                  'success'
                );
              })
              .catch((erro) => {
                loading.present();
                // console.log(erro);
              });
          },
        },
      ],
    });

    await alert.present();
  }
  async getLembretes() {
    this.fbstore
      .collection(`Lembretes`, (ref) =>
        ref.where('pertenceA', '==', this.usuarioId)
      )
      .snapshotChanges()
      .subscribe((data: any) => {
        this.lembretes = data.map((lista: any) => {
          // console.log(lista.payload.doc.data());
          return {
            id: lista.payload.doc.id,
            nome: lista.payload.doc.data().nome,
            horario: lista.payload.doc.data().horario,
            descricao: lista.payload.doc.data().descricao,
          };
        });
      });
  }
  async removerLembrete(id: any) {
    await this.fbstore
      .collection('Lembretes')
      .doc(id)
      .delete()
      .then((result) => {
        this.toastController.showToast(
          'Lembrete deletado com sucesso',
          2000,
          'success'
        );
        this.getLembretes();
      });
    // .catch((error) => console.log(error));
  }

 // Rest para lembretes
 async addEvolucao() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Registrar Evolução',
    message:'informe os campos abaixo',
    mode: 'md',
    inputs: [
      {
        name: 'nome',
        type: 'text',
        placeholder: 'Informe um nome',
      },
      {
        name: 'descricao',
        type: 'textarea',
        placeholder: 'Descreva uma evolução',
      },
      // input date with min & max
      {
        name: 'dataRegistro',
        type: 'datetime-local',
        label: 'Data do Registro',
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Adicionar',
        handler: async (alertData) => {
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Carregando aguarde...',
            duration: 1500,
            spinner: 'crescent',
          });

          const idRandom = Math.floor(Math.random() * 1000) + this.usuarioId;
          await this.fbstore
            .collection('Evolucao')
            .doc(idRandom)
            .set({
              pertenceA: this.usuarioId,
              nome: alertData.nome,
              dataRegistro: alertData.dataRegistro,
              descricao: alertData.descricao,
              criadoEm: this.dateToday,
            })
            .then(() => {
              this.toastController.showToast(
                'Evolução adicionada com sucesso',
                2000,
                'success'
              );
            })
            .catch((erro) => {
              loading.present();
              // console.log(erro);
            });
        },
      },
    ],
  });

  await alert.present();
}
async getEvolucoes() {
  this.fbstore
    .collection(`Evolucao`, (ref) =>
      ref.where('pertenceA', '==', this.usuarioId)
    )
    .snapshotChanges()
    .subscribe((data: any) => {
      this.evolucoes = data.map((lista: any) => {
        console.log(lista.payload.doc.data());
        return {
          id: lista.payload.doc.id,
          nome: lista.payload.doc.data().nome,
          dataRegistro: lista.payload.doc.data().dataRegistro,
          descricao: lista.payload.doc.data().descricao,
        };
      });
    });
}
async removerEvolucao(id: any) {
  await this.fbstore
    .collection('Evolucao')
    .doc(id)
    .delete()
    .then((result) => {
      this.toastController.showToast(
        'Evolucao deletada com sucesso',
        2000,
        'success'
      );
      this.getLembretes();
    });
  // .catch((error) => console.log(error));
}





}
