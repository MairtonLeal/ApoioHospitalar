import { Component, OnInit } from '@angular/core';
import { OnSignalAdminService } from '../services/onsignalAdmin.service';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { Keys } from '../core/Keys';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-detail-estadia',
  templateUrl: './detail-estadia.page.html',
  styleUrls: ['./detail-estadia.page.scss'],
})
export class DetailEstadiaPage implements OnInit {
  public atendimentoId = this.navParams.get('atendimentoId');
  public telefone = this.navParams.get('telefone');
  estadiaDados: any;
  tabInfo = 'informacoes';
  dataAtual = moment().locale('pt-br').format('DD/MM/YYYY, HH:mm');
  dataHistorico = moment().locale('pt-br').format('DDMMYYHHmm');
  mensagens: any;
  usuarioId: any;
  isModalChatOpen = false;
  mensagem = '';

  constructor(
    private navParams: NavParams,
    private fbstore: AngularFirestore,
    public modalController: ModalController,
    private toastController: ToastService,
    public alertController: AlertController,
    private oneSignalAdmin: OnSignalAdminService
  ) {

  }

  ngOnInit() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    this.getAtendimento();
    this.getMensagens();
    console.log(this.dataAtual);
  }

  async getAtendimento() {
    await this.fbstore
      .collection('Estadia')
      .doc(this.atendimentoId)
      .valueChanges()
      .subscribe((singleDoc: any) => {
        this.estadiaDados = singleDoc;
      });
  }

  async fechar() {
    await this.modalController.dismiss();
  }

  async cancelarComMotivo(id: any) {
    const alert = await this.alertController.create({
      header: 'Deseja cancelar atendimento ?',
      message: 'Após confirmação realizada, é necessario informar o motivo.',
      inputs: [
        {
          name: 'motivo',
          type: 'text',
          placeholder: 'Motivo do cancelamento',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',

        },
        {
          text: 'Confirmar',
          cssClass: 'confirm-button-service',
          handler: (data) => {
            this.salvarHistorico(id, data.motivo);
            // .catch((error) => console.log(error));
          },
        },
      ],
    });

    await alert.present();
  }

  async salvarHistorico(id: any, motivo: any) {
        // let historicoId = this.dataHistorico + this.usuarioId;
        this.fechar();
        this.toastController.showToast(
          'Sua Estadia foi cancelada!',
          1000,
          'success'
        );
        this.oneSignalAdmin.sendMessage(
          'Estadia Cancelado',
          `Sentimos muito, sua estadia foi cancelada`,
          this.estadiaDados.playerIdProf
        );
        this.fbstore
        .doc(`Estadia/${id}`)
        .update({
          statusEstadia: 'Cancelado',
        })
        .catch((error) => {
          console.log(error);
         
        });

  }

  async verificarStatus() {
    const alert = await this.alertController.create({
      header: 'Escolha a categoria',
      message: 'Selecione sua pergunta direcionada à seu profissional',
      cssClass: 'alert-class',
      inputs: [
        {
          label: 'Estou em frente ao hospital',
          type: 'radio',
          value: 'Estou em frente ao hospital',
        },
        {
          label: 'Estou na entrada de visitantes',
          type: 'radio',
          value: 'Estou na entrada de visitantes',
        },
        {
          label: 'Como está o estado do paciente ?',
          type: 'radio',
          value: 'Como está o estado do paciente ?',
        },
        {
          label: 'Precisa de algo para você ou o paciente?',
          type: 'radio',
          value: 'Precisa de algo para você ou para o paciente?',
        },
        {
          label: 'Como está os sinais vitais do paciente?',
          type: 'radio',
          value: 'Como está os sinais vitais do paciente?',
        },
        {
          label: 'Paciente passou por algum procedimento ou avaliação ?',
          type: 'radio',
          value: 'Paciente passou por algum procedimento ou avaliação ?',
        },

      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service2',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'confirm-button-service2',
          handler: (data: string) => {
            console.log('Alert confirmed', data);
            // this.enviarMensagemProf(data);
            // this.fbstore.doc('Idosos/'+this.usuarioId).update({
            //   gs: this.usuario.gs
            // }).then(() => {
            //   this.toastService.showToast('Grupo sanguineo com sucesso', 1000, 'success');
            //   }).catch(error => {
            //     console.log(error);
            //     this.toastService.showToast('Erro ao atualizar', 1000, 'danger')});
          },
        },
      ],

    });

    await alert.present();
  }


  async enviarMensagemProf() {
    this.fbstore
      .collection('Estadia')
      .doc(this.atendimentoId)
      .collection('Chat')
      .add({
        usuarioId: this.usuarioId,
        enviandoEm: this.dataAtual,
        mensagem: this.mensagem
      })
      .then(() => {
        this.mensagem = '';
        this.toastController.showToast('Mensagem enviada', 1000, 'success');
        this.getMensagens();
      })
      .catch((error) => {
        this.toastController.showToast(
          'Erro ao enviar mensagem.',
          1000,
          'danger'
        );
      });
  }


  async getMensagens() {
    this.fbstore
      .collection('Estadia')
      .doc(this.atendimentoId)
      .collection('Chat', (ref) => ref.orderBy('enviandoEm', 'asc'))
      .snapshotChanges()
      .subscribe((data: any) => {
        this.mensagens = data.map((mensagem: any) => {
          return {
            enviadoEm: mensagem.payload.doc.data().enviandoEm,
            mensagem: mensagem.payload.doc.data().mensagem,
            pertenceA: mensagem.payload.doc.data().usuarioId,
          };
        });
        of(data)
        .pipe(delay(1500))
        .subscribe(() => {
            
          });
      });
  }

  setOpenChat(isOpen: boolean) {
    this.isModalChatOpen = isOpen;
  }


}
