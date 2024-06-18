import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitacao-sucesso',
  templateUrl: './solicitacao-sucesso.page.html',
  styleUrls: ['./solicitacao-sucesso.page.scss'],
})
export class SolicitacaoSucessoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async fechar(){
    this.router.navigate(['/tabs/tab2']);
  }

}
