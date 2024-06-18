import { Router } from '@angular/router';
import { Keys } from './../core/Keys';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bem-vindo',
  templateUrl: './bem-vindo.page.html',
  styleUrls: ['./bem-vindo.page.scss'],
})
export class BemVindoPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(public router: Router,) { }

  async ngOnInit() {
    let user = await localStorage.getItem(Keys.userSollow)
    if(user !== null){
      this.router.navigate(['/tabs/tab1']);
    }
  }

  navigate(slide: any, index:any) {
    slide.slideTo(index)
  }

  skip(){
    this.router.navigate(['/login']);
  }

  start(){
    this.router.navigate(['/login']);
  }

  Slides = [
    {
      title: 'Encontre',
      text: 'Profissionais e seus serviços básicos e acompanhamentos diversos para facilitar seu dia-a-dia',
      // img: 'buscaProf.gif'
      img: 'map.gif'
    },
    {
      title: 'Solicite',
      text: 'Troca e aplicar curativos, estadias em hospitais, idas a consultas medicas etc.',
      img: 'servicos.gif',
      imgBottom: true,
    },
    {
      title: 'Locais',
      text: 'Profissionais podem atender em domicilio, hospitais dependendo do serviço',
      // img: 'notes.gif'
      img: 'map.gif',
    },
    {
      title: 'Agendamento',
      text: 'Defina seu horários, e por quantas horas será necessário',
      img: 'notes.gif',
      imgBottom: true,
    },
  ]





}
