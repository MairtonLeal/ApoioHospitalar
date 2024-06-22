
# Aplicativo de Estadia Hospitalar


Este é um projeto de aplicativo de estadia hospitalar desenvolvido com o Ionic Framework. O aplicativo utiliza Firebase para autenticação e banco de dados, e Google Maps para funcionalidades de geolocalização.

Pré-requisitos
Node.js: Certifique-se de ter o Node.js instalado em sua máquina. Download Node.js
Ionic CLI: Instale a CLI do Ionic globalmente:
```bash 

Copiar código
npm install -g @ionic/cli
Configuração do Firebase
Criação de Projeto no Firebase:
```

## Acesse o Firebase Console.
Clique em "Adicionar Projeto" e siga as instruções para criar um novo projeto.
Adicionar Aplicativo ao Firebase:

No seu projeto Firebase, adicione um novo aplicativo Android e/ou iOS.
Siga as instruções para registrar o aplicativo e baixar os arquivos de configuração (google-services.json para Android e GoogleService-Info.plist para iOS).
Configuração das Chaves do Firebase:

Coloque o arquivo google-services.json no diretório android/app do seu projeto Ionic.
Coloque o arquivo GoogleService-Info.plist no diretório ios/App/App do seu projeto Ionic.
Configuração da API do Google Maps
Criação de Projeto no Google Cloud Console:

## Acesse o Google Cloud Console.
Crie um novo projeto ou selecione um projeto existente.
Habilitar API do Google Maps:

No painel do Google Cloud Console, navegue até "APIs & Services" > "Library".
Pesquise por "Google Maps JavaScript API" e habilite-a.
Repita o processo para outras APIs do Google Maps que você possa precisar, como "Geocoding API", "Places API", etc.
Obtenha a Chave da API do Google Maps:

Navegue até "APIs & Services" > "Credentials".
Clique em "Create credentials" e selecione "API key".
Copie a chave da API gerada e adicione-a ao seu projeto Ionic.
Configuração do Projeto
Clone o Repositório:


```bash
Copiar código
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
Instale as Dependências:
```

Copiar código
npm install
Configuração de Variáveis de Ambiente:

Crie um arquivo src/environments/environment.ts com suas chaves Firebase e Google Maps:
typescript
Copiar código
export const environment = {
  production: false,
  firebase: {
    apiKey: "SUA_FIREBASE_API_KEY",
    authDomain: "SEU_FIREBASE_AUTH_DOMAIN",
    projectId: "SEU_FIREBASE_PROJECT_ID",
    storageBucket: "SEU_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "SEU_FIREBASE_MESSAGING_SENDER_ID",
    appId: "SEU_FIREBASE_APP_ID",
    measurementId: "SEU_FIREBASE_MEASUREMENT_ID"
  },
  googleMapsApiKey: 'SUA_GOOGLE_MAPS_API_KEY'
};
Comandos para Build
Android
Adicionar Plataforma Android:

```bash
Copiar código
ionic capacitor add android
Build do Projeto:
```

```bash 
Copiar código
ionic build
Sincronizar com Capacitor:
```


```bash 
Copiar código
npx cap sync
Abrir no Android Studio:

```

```bash 
Copiar código
npx cap open android
Gerar APK:

```

No Android Studio, construa o projeto para gerar o APK.
iOS
Adicionar Plataforma iOS:

```bash 

Copiar código
ionic capacitor add ios
Build do Projeto:
```

```bash 
Copiar código
ionic build
Sincronizar com Capacitor:
```

```bash 
Copiar código
npx cap sync
Abrir no Xcode:
```

```bash 
Copiar código
npx cap open ios
Gerar Build para iOS:
```

No Xcode, selecione um dispositivo e construa o projeto para gerar a build.
Recursos
- Documentação do Ionic
- Documentação do Firebase
- Documentação do Google Maps API
