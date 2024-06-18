import { Keys } from './../core/Keys';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AlertController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage  {
  tipoItem = 'servicos';
  carregando: any;
  meuServico: any;
  servicos: any;
  usuarioId: any;
  expandedIcon = true;
  expandedService = false;
  historicoAtendimentos: any;
  estadias: any;

  constructor(
    public alertController: AlertController,
    private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    private toastController: ToastService
  ) {}
  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    this.getServicosAgendados();
    this.getHistoricoAtendimentos();
    this.getEstadias();
  }

  async getUsuario() {
    //  Função para pegar dados diretamente do auth do usuário
    this.fbauth.authState.subscribe((data) => {
      if (data && data.email && data.uid) {
        console.log('autenticado.');
      } else {
        console.log('Não foi possível autenticar.');
      }
    });
  }
  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      this.getServicosAgendados();
      this.carregando = false;
    }, 2000);
  }

  getServicosAgendados() {
    this.carregando = true;
    this.fbstore
      .collection(`Servico`, (ref: any) => ref.where('historico', '==', true))
      .snapshotChanges()
      .subscribe((data: any) => {
        this.servicos = data.map((listaServicos: any) => {
          this.meuServico = listaServicos.payload.doc.data();
          this.carregando = false;
          if(listaServicos.payload.doc.data().idCliente === this.usuarioId && listaServicos.payload.doc.data().idCliente !== 'Confirmado' || listaServicos.payload.doc.data().idCliente === 'Solicitando') {
          return {
            id: listaServicos.payload.doc.id,
            idCliente: listaServicos.payload.doc.data().idCliente,
            idProfissional: listaServicos.payload.doc.data().idProfissional,
            data: listaServicos.payload.doc.data().dataEHora,
            procedimento: listaServicos.payload.doc.data().tipoServico,
            nome: listaServicos.payload.doc.data().nomeProfissional,
            foto: listaServicos.payload.doc.data().fotoProfissional,
            profissao: listaServicos.payload.doc.data().profissao,
            status: listaServicos.payload.doc.data().status,
            endereco: listaServicos.payload.doc.data().endereco,
            valor: listaServicos.payload.doc.data().valorServico,
            historico: listaServicos.payload.doc.data().historico,
            motivo: listaServicos.payload.doc.data().motivo,
          };
        } else {
          return null
        }
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }
  async avaliarProf(id: any, profissional: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Avaliar esse Profissional',
      mode:'ios',
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
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Avaliar',
          handler: (data) => {
            // console.log(id);
            this.fbstore.collection(`Avaliacao`).doc(id).set({
                notaAvaliacao: data,
                profAvaliado: profissional

            }).then(() => {
              this.toastController.showToast(
                'Avaliação realizada com sucesso',
                2000,
                'success'
              );
            }).catch((error: any) => {
              console.log(error);
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async getHistoricoAtendimentos() {
    this.fbstore
      .collection(`Historico`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.historicoAtendimentos = data.map((lista: any) => {
          this.carregando = false;
          if (
            lista.payload.doc.data().servico.idCliente === this.usuarioId
          ) {
            return {
              id: lista.payload.doc.id,
              status: lista.payload.doc.data().status,
              data: lista.payload.doc.data().servico.dataHora,
              cuidado: lista.payload.doc.data().servico.cuidadoAss,
              tipo: lista.payload.doc.data().servico.tipoCuidado,
              obs: lista.payload.doc.data().servico.obs,
              valor: lista.payload.doc.data().servico.valorCuidado,
              pagamento: lista.payload.doc.data().servico.formaPagamento,
              endereco: lista.payload.doc.data().servico.endereco,
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

  getEstadias() {
    this.carregando = true;
    this.fbstore
      .collection(`Estadia`, (ref: any) => ref.where('idCliente', '==', this.usuarioId))
      .snapshotChanges()
      .subscribe((data: any) => {
        this.estadias = data.map((lista: any) => {
          this.carregando = false;
      
            console.log(lista.payload.doc.data())
          return {
            id: lista.payload.doc.id,
            idProf: lista.payload.doc.data().idProfissional,
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
       
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }





}
