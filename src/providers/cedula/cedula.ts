import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Service } from '../../settings/Laravel';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class CedulaProvider {

  constructor(
    public http: HttpClient, 
    private storage: Storage,
    private authService: AuthProvider) {
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
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/getDiligencia`, { headers }).toPromise()
  }

  async getMotivo () 
  {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/getMotivo`, { headers }).toPromise()
  }

  async barcodeInfo (code) {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/barcodeInfo/`+code, { headers }).toPromise()
  }

  async findNot (nronot) {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/findNot/`+nronot, { headers }).toPromise()
  }

  async uploadData(data:any) {
    let accessToken: any = await this.authService.getAccessToken();
    let headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    });
    return this.http.post(`${Service.apiUrl}/uploadData`, data, { headers }).toPromise();
  }

}
