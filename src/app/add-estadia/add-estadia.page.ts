import { Keys } from './../core/Keys';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { ToastService } from '../services/toast.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OnSignalAdminService } from '../services/onsignalAdmin.service';
import { NativeGeocoder, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder';

declare var google: any;

@Component({
  selector: 'app-add-estadia',
  templateUrl: './add-estadia.page.html',
  styleUrls: ['./add-estadia.page.scss'],
})
export class AddEstadiaPage implements OnInit {

  @ViewChild('swiper') swiperRef!: ElementRef;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    pager: false,
    allowTouchMove: false,
  };

  address?: string;
  adressList!: any[]
  location: any;
  placeid: any;
  autocomplete!: { input: string };
  autocompleteItems!: any[];
  GoogleAutocomplete: any;
  geocoder = new google.maps.Geocoder();

  button = false;
  slideIndex = false;
  isLastIndex = false;
  mostrarPagar = false;
  tipoAtendimento: any; // Mapeia o tipo de atendimento
  servicosHosp: any;
  servicosHome: any;
  acompanhamento: any;
  obsIdoso = '';
  // diasAtendimento = 0;
  termino: any;
  dataInicio: any;
  horaInicio: any;
  dataHora: any;
  minDate = moment().toISOString();

  ambienteAcomp: any;
  profissionalId: any;
  usuarioId: any;
  // meuAtendimento = this.navParams.get('idProfissional');
  criadoEm = new Date().toLocaleString();
  // idProfissional = this.navParams.get('idProfissional');
  meuAtendimento: any;
  idProfissional: any;
  profissionalSelecionado: any;
  cuidadoSelecionado: any;

  valorCuidadoAss: any;

  cepCode: any;
  adressSelected = 'Endereço';
  districtAdress = '';
  locateAdress = '';
  numberAdress = '';
  complementAdress = '';
  stateAddress = '';
  countryAddress = '';
  cityAdrress = '';
  hospitalName = '';
  pontoDeEncontro = '';
  formaDePagamento: any;
  isHourDigitValid = true;
  isDayDigitValid = true;
  inputDisable = true;
  horasDeServico = 0;
  diasDeServico = 0;
  indexCount = 1;
  optAcompSelecionado = '';
  valorAtendimento = 0;
  acompanhamentoSelecionado: any;
  planoSelecionado: any;
  beneficioPagamento: any;
  modoPagamento: any;
  idosoUsuario: any;
  valorTotalEstadia: any;
  periodos = [
    {
      id: 1,
      descricao: 'Diária de periodo no hospital',
      tempo: '8 horas de estadia',
      tipo: 'Estadia Emergencial',
      valor: 130,
    },
    {
      id: 2,
      descricao: '2 dias completo no hospital',
      tempo: '16 horas de estadia',
      tipo: 'Estadia de Plantão',
      valor: 180,
    },
    {
      id: 3,
      descricao: 'Entre 3 até 5 dias no hospital',
      tempo: 'Estadia com intervalo do profissional',
      tipo: 'Estadia Prolongada',
      valor: 450,
    },

  ];
  itemsAvaliacao = [
    // { id: 1, nome: 'Mudança de decúbito',
    // descricao: 'Quando necessário auxilio em mudar de lugar.',
    // checked: false },
    // { id: 2, nome: 'Apoio durante banho', 
    // descricao: 'Em caso de necessidade de apoio.',
    // checked: false },
    // { id: 3, nome: 'Apoio Alimentar',
    // descricao: 'Quando necessário, apoio durante momentos de refeições.',
    // checked: false },
    {
      id: 1, nome: 'Recuperação de Fraturas Leves',
      descricao: 'Processo de recuperação e sua condição é estável',
      condicao: 'Pacientes que sofreram fraturas leves e estão no processo de recuperação. Eles podem precisar ficar acamados por um período para garantir uma cicatrização adequada, mas sua condição é estável.',
      checked: false
    },
    {
      id: 2, nome: 'Pós-operatório de Cirurgias Menores',
      descricao: 'Cuidados básicos de enfermagem e monitoramento de sinais vitais',
      condicao: 'Indivíduos que foram submetidos a cirurgias menores e precisam de repouso no leito durante o período inicial de recuperação. Eles precisam de cuidados básicos de enfermagem e monitoramento de sinais vitais',
      checked: false
    },
    {
      id: 3, nome: 'Doenças Crônicas Estáveis',
      descricao: 'Pacientes que temporariamente podem precisar ficar acamados devido a exacerbações leves de suas condições',
      condicao: 'Pacientes com doenças crônicas, que temporariamente podem precisar ficar acamados devido a exacerbações leves de suas condições, mas que não apresentam risco iminente à vida.',
      checked: false
    },
    {
      id: 4, nome: 'Idosos/Pacientes com Mobilidade Reduzida',
      descricao: 'Prevenir quedas e lesões, necessitando de assistência para atividades básicas',
      condicao: 'Devido à idade avançada e/ou condições como osteoporose ou fraqueza muscular, podem passar períodos acamados para prevenir quedas e lesões, necessitando de assistência para atividades básicas.',
      checked: false
    },
    {
      id: 5, nome: 'Convalescença de Infecções Leves',
      descricao: 'Precisam permanecer acamados por um curto período até a recuperação completa',
      condicao: 'Pacientes se recuperando de infecções leves, como gripes ou infecções urinárias, que precisam permanecer acamados por um curto período até a recuperação completa',
      checked: false
    },
    {
      id: 6, nome: 'Outro grupo',
      descricao: 'Não encontrei a definição ideal para esta estadia',
      condicao: '',
      checked: false
    },
  ];



  profissional: any;
  itemEstadia: any;

  constructor(
    private toastController: ToastService,
    private fbstore: AngularFirestore,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public modalController: ModalController,
    private httpClient: HttpClient,
    public alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private loadingController: LoadingController,
    private onesignalAdmin: OnSignalAdminService,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,

  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.meuAtendimento =
        this.router.getCurrentNavigation()?.extras.state?.['profissionalId'];
      this.profissional =
        this.router.getCurrentNavigation()?.extras.state?.['profissional'];
      
    } else {
      this.navCtrl.navigateBack(['/tabs/tab1']);
    }
  }

  ngOnInit() {
    this.usuarioId = localStorage.getItem(Keys.userSollow);
    this.platform.backButton.subscribeWithPriority(0, () => {
    });
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.dadosProfissional();
    this.getUsuario();
  }

  async getUsuario() {
    //  Função para pegar dados diretamente do auth do usuário
    await this.fbstore
      .collection('Idosos')
      .doc(this.usuarioId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.idosoUsuario = singleDoc;
        if (this.idosoUsuario.playerId) {
          this.idosoUsuario.playerId =  '';
        }
      });
      
  }

  async dadosProfissional() {
    await this.fbstore
      .collection('Profissionais')
      .doc(this.meuAtendimento)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.profissionalSelecionado = singleDoc;
        if (!this.profissionalSelecionado.playerId) {
          this.profissionalSelecionado.playerId = '';
        }
      });
  }

  async solicitarAtendimento() {

    this.button = true;

    const alert = await this.alertController.create({
      header: 'Confirmar sua solicitação?',
      message: 'Clique em confirmar para enviar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',
          handler: () => {
            this.button = false;
          },
        },
        {
          text: 'Confirmar',
          cssClass: 'confirm-button-service',
          handler: () => {
            try {
  
              //  Confirmar estadia
              let estadia = {
                idCliente: this.usuarioId,
                idProfissional: this.meuAtendimento,
                profissional: this.profissionalSelecionado.nomeUser,
                profissao: this.profissionalSelecionado.profissao,
                formaPagamento: this.formaDePagamento,
                dataHora: this.dataHora,
                // cuidadoAss: this.optAcompSelecionado,
                // tipoCuidado: this.tipoAtendimento,
                // diasDeEstadia: this.diasDeServico,
                // obsIdoso: this.obsIdoso,
                valorTotal: this.planoSelecionado.valor,
                estadia: this.planoSelecionado,
                informacoes: this.itemsAvaliacao,
                nomeHospital: this.hospitalName,
                pontoDeEncontro: this.pontoDeEncontro,
                endereco: {
                  cep: this.cepCode,
                  endereco: this.locateAdress,
                  bairro: this.districtAdress,
                  numero: this.numberAdress,
                  complemento: this.complementAdress,
                  cidade: this.cityAdrress,
                  estado: this.stateAddress,
                  pais: this.countryAddress
                },
                statusEstadia: 'Aguardando',
                beneficio: this.beneficioPagamento,
                criadoEm: this.criadoEm,
                fotoProfissional: this.profissionalSelecionado.fotoPerfil,
                fotoCliente: this.idosoUsuario.fotoPerfil,
                playerIdCliente: this.idosoUsuario.playerId,
                playerIdProf: this.profissionalSelecionado.playerId 
              };
               this.fbstore
                .collection('Estadia')
                .add(estadia)
                .then(() => {
                  this.button = false;
                  this.onesignalAdmin.sendMessage(
                    '',
                    `Você tem uma solicitação de estadia`,
                    this.profissionalSelecionado.playerId
                  );
                  this.modalController.dismiss({
                    atualizar: true,
                  });
                  this.router.navigate(['/solicitacao-sucesso']);
                })
                .catch((error) => {
                  this.button = false;
                  console.log(error);
                });
  
            } catch (error) {
              this.button = false;
              console.log(error);
            }
           
         
          },
        },
      ],
    });

    await alert.present();


  }

  async close() {
    this.navCtrl.navigateBack(['/tabs']);
  }

  async mudarAtendimento(atdSelecionado: any) {
    this.tipoAtendimento = atdSelecionado;
  }

  async next() {
    const index = await this.swiperRef?.nativeElement.swiper.activeIndex;
    console.log(index);
    if (index === 0) {
      if (this.hospitalName === '') {
        this.toastController.showToast(
          'Selecione seu hospital',
          1000,
          'danger'
        );
      } else if (this.pontoDeEncontro === '') {
        this.toastController.showToast('Informe o ponto de encontro', 1000, 'danger');
      }
      else if (this.dataHora === undefined) {
        this.toastController.showToast('Selecione o tipo', 1000, 'danger');
      }


      else {
        this.slideIndex = true;
        this.swiperRef?.nativeElement.swiper.slideNext();
        this.scrollTop();
        this.indexCount++;
      }
    } else if (index === 1) {
      if (this.planoSelecionado === undefined) {
        this.toastController.showToast('Escolha o tipo de estadia', 1000, 'danger');
      }
      else if (this.formaDePagamento === undefined) {
        this.toastController.showToast(
          'Informe sua forma de pagamento',
          1000,
          'danger'
        );
      }
      else if (this.beneficioPagamento === undefined) {
        this.toastController.showToast(
          'Informe sua escolha de alimentação',
          1000,
          'danger'
        );
      }

      else {
        this.swiperRef?.nativeElement.swiper.slideNext();
        this.scrollTop();
        this.indexCount++;
      }
    } else if(index === 2) {
      this.swiperRef?.nativeElement.swiper.slideNext();
          this.scrollTop();
          this.indexCount++;
          this.mostrarPagar = true;
          this.isLastIndex = true

    }
    
    // else if (index === 3) {
    //   this.slides.slideNext();
    //   this.scrollTop();
    //   this.indexCount++;
    //   this.mostrarPagar = true;
    //   this.isLastIndex = true
    //   // if (this.cepCode === undefined) {
    //   //     this.toastController.showToast('Digite o cep', 1000, 'danger');
    //   //   } else if (this.districtAdress === '') {
    //   //     this.toastController.showToast('Digite o bairro', 1000, 'danger');
    //   //   } else if (this.locateAdress === '') {
    //   //     this.toastController.showToast('Digite o endereço', 1000, 'danger');
    //   //   } else if (this.numberAdress === '') {
    //   //     this.toastController.showToast('Digite o numero', 1000, 'danger');
    // }

  }

  async prev() {
    const index = await this.swiperRef?.nativeElement.swiper.activeIndex;
    if (index === 1) {
      this.slideIndex = false;
      this.indexCount--;
      await  this.swiperRef?.nativeElement.swiper.slidePrev();
    } else if (index === 3) {
      this.mostrarPagar = true;
    } else {
      this.mostrarPagar = false;
      this.slideIndex = true;
      this.indexCount--;
      await  this.swiperRef?.nativeElement.swiper.slidePrev();
    }
  }
  async voltarELimpar() {
    const index = await this.swiperRef?.nativeElement.swiper.activeIndex;    this.isLastIndex = false;
    this.mostrarPagar = false;
    this.indexCount = 0;
    this.swiperRef?.nativeElement.swiper.slideTo(0)

  }

  scrollTop() {
    this.content.scrollToTop(1500);
  }


  validacaoHoras(horaDigitada: number) {
    if (horaDigitada !== 0 || horaDigitada) {
      this.isHourDigitValid = false;
    } else {
      this.isHourDigitValid = true;
    }

  }

  validacaoDias(diaDigitado: number) {
    if (diaDigitado !== 0 || diaDigitado) {
      this.isDayDigitValid = false;
    } else {
      this.isDayDigitValid = true;
    }
  }

  async escolherPlano(plano: any) {
    this.planoSelecionado = plano;
    this.valorTotalEstadia = this.planoSelecionado.valor + 9.99;
  }

  // async addItems(itemSelecionado: any){
  //   this.itemEstadia = itemSelecionado
   
  // }

  // Recebe o endereço que vai gerar através das coordenadas abaixo
  getAddressFromCoords() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.nativeGeocoder
      .reverseGeocode(-1.4554, -48.4902, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = '';
        const responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ', ';
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        console.log(error);
        this.address = 'Address Not Available!';
      });
  }

  // Autocompleta e simplesmente carrega os locais usando gooogle preditcions e retorna em array
  // #TODO melhorar busca ao esconder cards
  UpdateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions: any, status: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction: any) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }

  // Podemos configurar funções complexas como carregar dados to firestore ou linkar para algo
  SelectSearchResult(item: any) {
    this.placeid = item.place_id;
    // this.selectNewSearchResult(this.placeid);
  }

  // Limpa o componente search de pesquisa
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  selectNewSearchResult(item: any) {
    console.log(item);
    this.placeid = item.place_id;
    this.hospitalName = item.description;
    this.geocoder.geocode({ placeId: this.placeid }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        this.adressList = results[0]?.['address_components'];
        this.adressList.forEach(element => {
          if (element.types.includes("street_number")) {
            this.numberAdress = element.long_name;
          } else if (element.types.includes("route")) {
            this.locateAdress = element.long_name;
          } else if (element.types.includes("sublocality")) {
            this.districtAdress = element.long_name;
          } else if (element.types.includes("administrative_area_level_2")) {
            this.cityAdrress = element.long_name;
          } else if (element.types.includes("administrative_area_level_1")) {
            this.stateAddress = element.short_name; // Usar short_name para o estado
          } else if (element.types.includes("country")) {
            this.countryAddress = element.long_name;
          } else if (element.types.includes("postal_code")) {
            this.cepCode = element.long_name;
          }
        });
        this.ClearAutocomplete();
      }
    });
  }



}
