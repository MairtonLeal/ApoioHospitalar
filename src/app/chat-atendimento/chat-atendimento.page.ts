import { ToastService } from '../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavParams, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as moment from 'moment';
import { Keys } from './../core/Keys';
@Component({
  selector: 'app-chat-atendimento',
  templateUrl: './chat-atendimento.page.html',
  styleUrls: ['./chat-atendimento.page.scss'],
})
export class ChatAtendimentoPage implements OnInit {
  public atendimentoId = this.navParams.get('atendimentoId');
  atendimentoDados: any;
  profdoAtendimento: any;
  usuario: any;
  mensagem = '';
  dataAtual = moment().locale('pt-br').format('DD/MM/YYYY, HH:mm');
  mensagens: any;
  usuarioId: any;
  constructor(
    private navParams: NavParams,
    private fbstore: AngularFirestore,
    public modalController: ModalController,
    private toastController: ToastService
  ) {}

  ngOnInit() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    this.getAtendimento();
    this.getMensagens();
  }

  async getAtendimento() {
    this.fbstore
      .collection('estadia')
      .doc(this.atendimentoId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.atendimentoDados = singleDoc;
        // this.getProfissional(this.atendimentoDados.idSP);
        this.getUsuario(this.atendimentoDados.idCliente);
      });
  }

  async getUsuario(id: any) {
    this.fbstore
      .collection('Idosos')
      .doc(id)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.usuario = singleDoc;
      });
  }

  async enviarMensagemProf() {
    this.fbstore
      .collection('estadia')
      .doc(this.atendimentoId)
      .collection('Chat')
      .add({
        usuarioId: this.usuarioId,
        enviandoEm: this.dataAtual,
        mensagem: this.mensagem,
        enviadoPor: this.usuario.nomeResp,
      })
      .then(() => {
        this.mensagem = '';
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
      .collection('estadia')
      .doc(this.atendimentoId)
      .collection('Chat', (ref) => ref.orderBy('enviandoEm', 'asc'))
      .snapshotChanges()
      .subscribe((data: any) => {
        this.mensagens = data.map((mensagem: any) => {
          return {
            enviandoEm: mensagem.payload.doc.data().enviandoEm,
            mensagem: mensagem.payload.doc.data().mensagem,
            enviadoPor: mensagem.payload.doc.data().enviadoPor,
            pertenceA: mensagem.payload.doc.data().usuarioId,
          };
          // console.log(mensagem.payload.doc.data());
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            // algo para atualizar refresh depois
          });
      });
  }

  async fechar() {
    await this.modalController.dismiss();
  }
}
