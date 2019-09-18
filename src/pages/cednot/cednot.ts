import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Modal, ModalController } from 'ionic-angular';

import { CedulaProvider } from '../../providers/cedula/cedula';

/**
 * Generated class for the CednotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cednot',
  templateUrl: 'cednot.html',
})
export class CednotPage {

  public nronot:any;
  data: any = {
    exp: '',
    ced: '',
    juz: '',
    img: '',
    lat: '',
    lng: '',
    fhr: '',
  };
  public loading: any;

  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private cedulaService: CedulaProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public toastCtrl:ToastController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CednotPage');
  }

  openPage(page){
    this.navCtrl.push(page);
  }

  search(nronot:any) {
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    console.log("nronot: "+nronot);
    if (nronot != '') {
      this.cedulaService.findNot(nronot)
        .then((response: any) => {
          if (typeof response.success !== 'undefined' && response.success.length > 0) {
            this.loading.dismiss();
            
            this.data.exp = response.success[0];
            this.data.ced = response.success[1];
            this.data.juz = response.success[2];
            this.data.img = response.success[3];
            this.data.lat = response.success[4];
            this.data.lng = response.success[5];
            this.data.fhr = response.success[6];
            
            // push page
            this.navCtrl.push('CednotdetPage',{
              data:this.data
            });
  
            // push modal page - error google maps in android
            /*const modal: Modal = this.modalCtrl.create('CednotdetPage', {data: this.data});
            modal.present();
            modal.onDidDismiss((data) => {
              console.log(data);
            });*/
  
          }else {
            var errMsg = response.error[0];
            this.loading.dismiss();
            const toast = this.toastCtrl.create({
              message: errMsg,
              duration: 4000,
              position: 'bottom'
            });
            toast.present();
          }
        })
        .catch(err => {
          debugger
          let alert = this.alertCtrl.create({ title: 'Error', buttons: ['Ok'] });
          alert.setMessage('Error al obtener el detalle de la cedula<br>'+err);
          alert.present();
        });
    }else{
      this.loading.dismiss();
      const toast = this.toastCtrl.create({
        message: 'Debe ingresar un número de cédula.',
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  checkInput(ev){
    this.nronot = ev.target.value.match(/[0-9-]*/);
  }

}
