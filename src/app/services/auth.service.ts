/* eslint-disable @typescript-eslint/member-ordering */
import {Injectable} from '@angular/core';
import {Keys} from '../core/Keys';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: any;

  private userToken: any;

  constructor(private httpClient: HttpClient) {
    this.loadDataByStorage();
  }

  isLogged(): boolean {
    this.loadDataByStorage();
    return this.userToken !== null;

  }

  getUserData() {
    this.loadDataByStorage();
    return this.userData;
  }
  private loadDataByStorage(){
    this.userData = JSON.stringify(localStorage.getItem(Keys.userSollow));
    this.userToken = localStorage.getItem(Keys.token);
  }


}
