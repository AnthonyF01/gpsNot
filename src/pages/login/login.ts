import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  formLogin: any = {
    name: '',
    password: '',
  };

  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private authService: AuthProvider,
    private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(data: any) {
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    this.authService.login(data)
      .then((response: any) => {
        this.authService.storeCredentials(response);
        this.navCtrl.setRoot(HomePage);
        this.loading.dismiss();
      })
      .catch(err => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({ title: 'Error', buttons: ['Ok'] });
        if ( err.status == 400 ) {
          alert.setMessage(`${err.error.hint}`);
        } else if (err.status == 401) {
          alert.setMessage(`${err.error.message}`);
        } else {
          // alert.setMessage('Error desconocido al iniciar sesión');
          alert.setMessage('Usuario o contraseña incorrectos');
        }
        alert.present();
      });
  }

}
