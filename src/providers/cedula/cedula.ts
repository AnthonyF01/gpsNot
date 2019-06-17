import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Service } from '../../settings/Laravel';

@Injectable()
export class CedulaProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  /*async findExpediente (search:string, param:boolean) 
  {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    if (param) {
      return this.http.get(`${Service.apiUrl}/denuncia/searchDNI/${search}`, { headers }).toPromise()      
    }else{
      return this.http.get(`${Service.apiUrl}/denuncia/search/${search}`, { headers }).toPromise()
    }
  }

  async findVictima (search:string) 
  {
    return this.http.get(`${Service.apiUrl}/denuncia/victima/search/${search}`).toPromise()
  }

  async detailsVictimaExp (){
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/denuncia/victima/details`, { headers }).toPromise();
  }

  async detailsExpediente (search:string) 
  {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/denuncia/details/${search}`, { headers }).toPromise()
  }*/

  async getDiligencia () 
  {
    return this.http.get(`${Service.apiUrl}/getDiligencia`).toPromise()
  }

  async getMotivo () 
  {
    return this.http.get(`${Service.apiUrl}/getMotivo`).toPromise()
  }

}
