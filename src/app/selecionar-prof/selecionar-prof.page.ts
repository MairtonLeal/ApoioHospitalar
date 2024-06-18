import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { Keys } from '../core/Keys';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-selecionar-prof',
  templateUrl: './selecionar-prof.page.html',
  styleUrls: ['./selecionar-prof.page.scss'],
})
export class SelecionarProfPage implements OnInit {
  public profissionalSelecionado = this.navParams.get(
    'profissionalSelecionado'
  );
  public  profissionalId = this.navParams.get(
    'profissionalId'
  );
  public tipoRota = this.navParams.get('tipoRota');
  selectOption: any;
  usuarioId: any;
  infoVazia: any;
  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    private toastController: ToastService,
    private fbstore: AngularFirestore,
    public alertController: AlertController,
    public router: Router,
    private loadingCtrl: LoadingController,
    private navController: NavController
  ) {
    this.usuarioId = localStorage.getItem(Keys.userSollow);

  }

  ngOnInit() {
    this.getAtendimento();
  }

  async fechar() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      duration: 500,
      spinner: 'crescent',
      cssClass: 'loading-class'
    })
    loading.present();
    this.modalController.dismiss();
  }

  selecionarOpcao(selected: any) {
    this.selectOption = selected;
  }

  async irParaRota() {
    if (this.selectOption === 1) {
      await this.fechar();
      let navigationExtras: NavigationExtras = {
        state: {
          profissional: this.profissionalSelecionado,
          profissionalId: this.profissionalId,
        },
      };
      await this.router.navigate(['order-prof'], navigationExtras);
    } else if (this.selectOption === 2) {
      await this.fechar();
      let navigationExtras: NavigationExtras = {
        state: {
          idProfissional: this.profissionalId,
        },
      };
      // this.navController.navigateForward(['add-atendimento'], navigationExtras);
      this.router.navigate(['add-atendimento'], navigationExtras);
      // const modal = await this.modalController.create({
      //   component: AddAtendimentoPage,
      //   cssClass: 'my-custom-class',
      //   mode: 'ios',
      //   swipeToClose: false,
      //   componentProps: {
      //     idProfissional: this.profissionalId,
      //   },
      // });
      // modal.present();
    }
  }

  async getAtendimento() {
    const refAtendimento = this.fbstore.collection(`Atendimento`, (ref) =>
      ref.where('idCLiente', '==', this.usuarioId)
    );
    refAtendimento.get().subscribe((data) => {
      if (data.empty) {
        console.log('esta vazio');
        this.infoVazia = false;
      } else {
        console.log('nao esta vazio');
        this.infoVazia = true;
      }
    });
  }



}
