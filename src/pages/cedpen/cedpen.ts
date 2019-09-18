import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Modal, ModalController } from 'ionic-angular';

import { CedulaProvider } from '../../providers/cedula/cedula';

/**
 * Generated class for the CedpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cedpen',
  templateUrl: 'cedpen.html',
})
export class CedpenPage {

  public dni:string='';
  public loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private cedulaService: CedulaProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public toastCtrl:ToastController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CedpenPage');
  }

  search() {
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
  }

}
