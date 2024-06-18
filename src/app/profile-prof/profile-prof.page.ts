import { Keys } from './../core/Keys';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SelecionarProfPage } from '../selecionar-prof/selecionar-prof.page';
@Component({
  selector: 'app-profile-prof',
  templateUrl: './profile-prof.page.html',
  styleUrls: ['./profile-prof.page.scss'],
})
export class ProfileProfPage implements OnInit {
  tipoRota: any;
  profissional: any;
  profissionalId: any;
  atendimento = 'De segunda à sexta';
  data: any;
  carregando: any;
  meuServico: any;
  servicos: any;
  vazio: any;
  usuarioId: any;
  constructor(
    public modalController: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private fbstore: AngularFirestore,
    private fbauth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.usuarioId = localStorage.getItem(Keys.token);
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.profissionalId =
        this.router.getCurrentNavigation()?.extras.state?.['profissionalId'];
      this.tipoRota =
        this.router.getCurrentNavigation()?.extras.state?.['tipoRota'];
    } else {
      this.navCtrl.navigateBack(['/tabs/tab1']);
    }
    this.getUsuario();
  }

  async getUsuario() {
    //  Função para pegar dados diretamente do auth do usuário
    this.fbstore
      .collection('Profissionais')
      .doc(this.profissionalId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.profissional = singleDoc;
        // console.log(this.profissional);
      });
  }



  async close() {
    await this.navCtrl.navigateBack(['/tabs/tab1']);
  }

  async escolherTipoServico(profissionalSelecionado: any) {
    const modal = await this.modalController.create({
      component: SelecionarProfPage,
      cssClass: 'modal-atendimento',
      // swipeToClose: true,
      componentProps: {
        profissionalSelecionado: profissionalSelecionado,
        profissionalId: this.profissionalId,
      },
    });
    return await modal.present();
  }

  async iniciarChamada() {
    let navigationExtras: NavigationExtras = {
      state: {
        profissional: this.profissional,
        profissionalId: this.profissionalId,
      },
    };
    await this.router.navigate(['/add-estadia'], navigationExtras);
  }

}
