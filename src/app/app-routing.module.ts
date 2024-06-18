import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/bem-vindo',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroPageModule)
  },

  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'profile-prof',
    loadChildren: () => import('./profile-prof/profile-prof.module').then( m => m.ProfileProfPageModule)
  },
  {
    path: 'bem-vindo',
    loadChildren: () => import('./bem-vindo/bem-vindo.module').then( m => m.BemVindoPageModule)
  },
  {
    path: 'profile-user',
    loadChildren: () => import('./profile-user/profile-user.module').then( m => m.ProfileUserPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
  },

  {
    path: 'chat-atendimento',
    loadChildren: () => import('./chat-atendimento/chat-atendimento.module').then( m => m.ChatAtendimentoPageModule)
  },

  {
    path: 'esqueci-senha',
    loadChildren: () => import('./esqueci-senha/esqueci-senha.module').then( m => m.EsqueciSenhaPageModule)
  },

  {
    path: 'selecionar-prof',
    loadChildren: () => import('./selecionar-prof/selecionar-prof.module').then( m => m.SelecionarProfPageModule)
  },
  {
    path: 'solicitacao-sucesso',
    loadChildren: () => import('./solicitacao-sucesso/solicitacao-sucesso.module').then( m => m.SolicitacaoSucessoPageModule)
  },
  {
    path: 'add-estadia',
    loadChildren: () => import('./add-estadia/add-estadia.module').then( m => m.AddEstadiaPageModule)
  },
  {
    path: 'detail-estadia',
    loadChildren: () => import('./detail-estadia/detail-estadia.module').then( m => m.DetailEstadiaPageModule)
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
