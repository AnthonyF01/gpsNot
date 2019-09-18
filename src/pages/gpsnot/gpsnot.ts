import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, AlertController, ListHeader } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

import { Service } from '../../settings/Laravel';
import { CedulaProvider } from '../../providers/cedula/cedula';

/**
 * Generated class for the GpsnotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gpsnot',
  templateUrl: 'gpsnot.html',
})
export class GpsnotPage {

  public loading: any;
  public flag:any = false;
  public img:any = false;

  public nbarcode:any;
  public nexp:string='';
  public fexp:string='';
  public sij:string;
  public fced:string='';
  public nced:string='';
  public csede:string='';
  public cdesc:string=''; // codigo desconocido
  public cinc:string='';
  public cjuz:string='';

  public expediente;
  public cedula;
  public juzgado;

  myphoto:any;
  urlToShow:any;

  // Geolocation
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
 
  watchLocationUpdates:any; 
  isWatching:boolean;
 
  // Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  diligencias: Array<{ value:string, name:string }>;
  motivos: Array<{ value:string, name:string }>;

  tbldiligencia_id: any;
  tblmotivo_id: any;

  formRegister: any = {
    sij:'',
    nced:'',
    fced:'',
    nexp:'',
    fexp:'',
    cinc:'',
    csede:'',
    code:'',
    expediente:'',
    juzgado:'',
    cedula:'',
    tblmotivo_id:'',
    tbldiligencia_id:'',
    tblinstancia_id:'',
    lat:'',
    lng:'',
    img:'',
  }

  constructor(
    public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    public http:Http,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer, 
    private file: File,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public toastCtrl:ToastController,
    private alertCtrl: AlertController,
    private cedulaService: CedulaProvider,) {
      // get diligencias
      this.cedulaService.getDiligencia()
      .then((response: any) => {
        this.diligencias = [];
        for (let index = 0; index < response.diligencia.length; index++) {
          this.diligencias.push({ value: response.diligencia[index].id, name: response.diligencia[index].nombre });          
        }
        console.log(this.diligencias);
      })
      .catch(err => {
        let alert = this.alertCtrl.create({ title: 'Error', buttons: ['Ok'] });
        alert.setMessage('Error al obtener las diligencias<br>'+err);
        alert.present();
      });

      // get motivos
      this.cedulaService.getMotivo()
      .then((response: any) => {
        this.motivos = [];
        for (let index = 0; index < response.motivo.length; index++) {
          this.motivos.push({ value: response.motivo[index].id, name: response.motivo[index].nombre });          
        }
        console.log(this.motivos);
      })
      .catch(err => {
        let alert = this.alertCtrl.create({ title: 'Error', buttons: ['Ok'] });
        alert.setMessage('Error al obtener los motivos<br>'+err);
        alert.present();
      });
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.nbarcode = barcodeData['text'];
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      this.nbarcode = JSON.stringify(err);
      console.log('Error', err);
    });
  }

  search(code:string) {
    this.formRegister.code = code;
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    this.clear();
    code = code.toString();
    code=code+"";
    console.log(code);
    // alert(code.lenght);
    if (code.length == 33) {
      for (let index = 0; index < code.length; index++) {
        if (index == 0) {
          this.sij=code[index];
        }
        if (index>=1&&index<=4) {
          this.fced+=code[index];
        }
        if (index>=5&&index<=10) {
          this.nced+=code[index];
        }
        if (index>=11&&index<=14) {
          this.fexp+=code[index];
        }
        if (index>=15&&index<=19) {
          this.nexp+=code[index];
        }
        if (index>=20&&index<=23) {
          this.csede+=code[index];
        }
        if (index>=24&&index<=26) {
          this.cdesc+=code[index];
        }
        if (index>=27&&index<=29) {
          this.cinc+=code[index];
        }
        if (index>=30&&index<=32) {
          this.cjuz+=code[index];
        }
      }
      console.log(this.sij+'-'+this.fced+'-'+this.nced+'-'+this.fexp+'-'+this.nexp+'-'+this.csede+'-'+this.cdesc+'-'+this.cinc+'-'+this.cjuz);
      this.cedulaService.barcodeInfo(code)
        .then((response: any) => {
          if (typeof response.success !== 'undefined' && response.success.length > 0) {
            this.flag = true;
            var dt = response.success;
            console.log(dt);
            this.expediente = dt[0];
            this.cedula = dt[1];
            this.juzgado = dt[2];
            this.loading.dismiss();
  
            // register fields
            this.formRegister.expediente = this.expediente;
            this.formRegister.cedula = this.cedula;
            this.formRegister.juzgado = this.juzgado;
            this.formRegister.tblinstancia_id = dt[3];
  
          } else {
            this.flag = false;
            this.clear();
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
          console.log(err);
        });
    } else {
      this.flag = false;
      this.clear();
      this.loading.dismiss();
      const toast = this.toastCtrl.create({
        message: 'El código de barras debe tener una longitud exacta de 33 caracteres.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  clear(){
    this.sij='';
    this.fced='';
    this.nced='';
    this.fexp='';
    this.nexp='';
    this.csede='';
    this.cdesc='';
    this.cinc='';
    this.cjuz='';
    
    this.expediente='';
    this.cedula='';
    this.juzgado='';

    this.formRegister.sij='',
    this.formRegister.nced='',
    this.formRegister.fced='',
    this.formRegister.nexp='',
    this.formRegister.fexp='',
    this.formRegister.cinc='',
    this.formRegister.csede='',
    this.formRegister.code='';
    this.formRegister.expediente='';
    this.formRegister.juzgado='';
    this.formRegister.cedula='';
    this.formRegister.tblmotivo_id='';
    this.formRegister.tbldiligencia_id='';
    this.formRegister.tblinstancia_id='';
    this.formRegister.lat='';
    this.formRegister.lng='';
  }

  // tomar foto
  takePhoto (){
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL, // funciona
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.loading.dismiss();
      console.log(imageData);
      this.myphoto = 'data:image/png;base64,' + imageData;
    }, (err) => {
      this.loading.dismiss();
      // Handle error
    });
  }
  
  // seleccionar foto
  getImage (){
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.loading.dismiss();
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.loading.dismiss();
      // Handle error
    });
  }

  cropImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit:true,
      targetWidth:  1920,
      targetHeight: 1080,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  //Get current coordinates of device
  getGeolocation(){
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    let options = {
      enableHighAccuracy:true,
      timeout: 5000,
      maximumAge: 3000
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      this.formRegister.lat = resp.coords.latitude;
      this.formRegister.lng = resp.coords.longitude;
      
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.geoAccuracy = resp.coords.accuracy;
      this.loading.dismiss();
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
    }).catch((error) => {
      alert('Error getting location'+ JSON.stringify(error));
      this.loading.dismiss();
    });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude,longitude){
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.loading.dismiss();
      this.geoAddress = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj){
    this.loading = this.loadingCtrl.create({content: 'Espere ...'});
    this.loading.present();
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      address += obj[val]+', ';
    }
    this.loading.dismiss();
    return address.slice(0, -2);
  }

  //Start location update watch
  watchLocation(){
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
    });
  }

  //Stop location update watch
  stopLocationWatch(){
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }

  uploadData() {
    this.formRegister.code = this.nbarcode.toString();
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...',
      dismissOnPageChange: true
    });
    this.loading.present();

    // search()
    this.formRegister.sij = this.sij;
    this.formRegister.nced = this.nced;
    this.formRegister.fced = this.fced;
    this.formRegister.nexp = this.nexp;
    this.formRegister.fexp = this.fexp;
    this.formRegister.cinc = this.cinc;
    this.formRegister.csede = this.csede;
  
    let data = JSON.stringify({
      sij: this.formRegister.sij,
      nced: this.formRegister.nced,
      fced: this.formRegister.fced,
      nexp: this.formRegister.nexp,
      fexp: this.formRegister.fexp,
      cinc: this.formRegister.cinc,
      csede: this.formRegister.csede,
      code: this.formRegister.code,
      expediente: this.formRegister.expediente,
      juzgado: this.formRegister.juzgado,
      cedula: this.formRegister.cedula,
      tblmotivo_id: this.formRegister.tblmotivo_id,
      tbldiligencia_id: this.formRegister.tbldiligencia_id,
      tblinstancia_id: this.formRegister.tblinstancia_id,
      lat: this.formRegister.lat,
      lng: this.formRegister.lng,
      img: this.formRegister.img,
    });
  
    /*
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      });
      let options = new RequestOptions({ headers: headers });

      if (this.formRegister.code != '' && this.formRegister.expediente != '' && this.formRegister.juzgado != '' && this.formRegister.cedula != '' && this.formRegister.tblmotivo_id != '' && this.formRegister.tbldiligencia_id != '' && this.formRegister.tblinstancia_id != '' && this.formRegister.lat != '' && this.formRegister.lng != '' ){
        return new Promise((resolve, reject) => {
          this.http.post(`${Service.apiUrl}/uploadData`, data, options)
          .toPromise()
          .then((response) =>
          {
            // this.uploadFile();
            console.log(response);
            this.loading.dismiss();
          })
          .catch((error) =>
          {
            console.error('API Error : ', error.status);
            console.error('API Error : ', error.json().error);
          });
        });
      }
    */

    this.cedulaService.uploadData(data)
      .then((response: any) => {
        console.log(response);
        /* 
        * Primero se sube la imagen y luego se registra
        * se usa primero la funcion uploadFile() y luego uploadData()
        * buscar la manera de subir la imagen usando laravel
        * la imagen se sube con el archivo uploadImage.php
        */
        // this.uploadFile(this.formRegister.cedula);
        this.loading.dismiss();
        if (response.fail) {
          const toast = this.toastCtrl.create({
            message: response.errors,
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
        if (response.status == 'success') {
          const toast = this.toastCtrl.create({
            message: response.info,
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
      })
      .catch(err => {
        console.log(err);
        this.loading.dismiss();
      });
    
  }

  uploadFile() {
    // show loading
    let loader  = this.loadingCtrl.create({
      content: 'Uploading...'
    });
    loader.present();

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    // random int
    var random = Math.floor(Math.random()*100);

    // current time
    var myDate = new Date();
    var dateFormat = `${myDate.getFullYear()}${myDate.getMonth()+1}${myDate.getDate()}${myDate.getHours()}${myDate.getMinutes()}${myDate.getSeconds()}`;

    // option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: this.formRegister.cedula+'_'+dateFormat+'.jpg',
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: 'image/jpeg',
      headers: {}
    }

    console.log(this.myphoto);

    // file transfer action
    fileTransfer.upload(this.myphoto,`${Service.apiUrl}/uploadFile`,options)
    // fileTransfer.upload(this.myphoto,`${Service.url}/uploadImage.php`,options)
      .then((data) => {
        console.log(data);
        if (data.responseCode == 200 && data.response != 'error') {
          console.log(data.response);
          this.img = true;
          this.formRegister.img = data.response;
          const toast = this.toastCtrl.create({
            message: 'La imagen ha sido cargada.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }else{
          this.img = false;
          const toast = this.toastCtrl.create({
            message: 'Ocurrió un problema al intentar subir la imagen.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
        loader.dismiss();
      }, (err) => {
        this.img = false;
        console.log(err);
        alert("Error");
        loader.dismiss();
      })
  }

  checkInput(ev){
    this.nbarcode = ev.target.value.match(/[0-9-]*/);
    // alert(this.nbarcode);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GpsnotPage');
  }

}
