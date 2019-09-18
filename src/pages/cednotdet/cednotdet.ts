import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Geocoder, 
  GeocoderRequest, 
  GeocoderResult,
  Environment,
 } from '@ionic-native/google-maps';

import { Service } from '../../settings/Laravel';

/**
 * Generated class for the CednotdetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*
 * Para configurar un mapa agregar la apikey en src/index.html
 * seguir este tutorial: https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
 * usar el plugin cordova-plugin-googlemaps
*/

declare var google;

@IonicPage()
@Component({
  selector: 'page-cednotdet',
  templateUrl: 'cednotdet.html',
})
export class CednotdetPage {

  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  environment: Environment = null;

  exp:any;
  ced:any;
  juz:any;
  img:any;
  lat:any;
  lng:any;
  fhr:any;

  url:any = `${Service.url}`;

  constructor(
    private navParams: NavParams, 
    private view: ViewController,
    private googleMaps: GoogleMaps, ) {
  }

  environmentMap(): void{
    this.environment = new Environment();
    this.environment.setBackgroundColor("white");
  }

  close() {
    const data = {
      foo: 'foo',
      bar: 'bar',
    }
    this.view.dismiss(data);
  }

  // carga completa de la pagina
  ionViewDidLoad() {
    console.log("ionViewDidLoad: "+this.lat+','+this.lng);
    this.loadMap(this.lat,this.lng);
    this.environmentMap();
  }

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    this.exp = data.exp;
    this.ced = data.ced;
    this.juz = data.juz;
    this.img = data.img;
    this.lat = data.lat;
    this.lng = data.lng;
    this.fhr = data.fhr;
    this.url += data.img;
    console.log(data);
    console.log(this.url);
  }

  loadMap(lat:any, lng:any){

    /*
      * Para configurar un mapa agregar la apikey en src/index.html
      * seguir este tutorial: https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
      * usar el plugin cordova-plugin-googlemaps
    */

    console.log(lat+" - "+lng);
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');
  
    this.map = this.googleMaps.create(element);
    
    // setting lat & long
    let location: any = {};
    location = {
      latitude: Number(lat),
      longitude: Number(lng)
    }

    // create CameraPosition
    let position: CameraPosition<LatLng> = {
      // target: new LatLng(this.myPosition.latitude, this.myPosition.longitude),
      target: new LatLng(location.latitude, location.longitude),
      zoom: 15,
      tilt: 30
    };
  
    this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
      console.log('Map is ready!');
  
      // move the map's camera to position
      this.map.moveCamera(position);

      let markerOptions: MarkerOptions = {
        // position: this.myPosition,
        position: location,
        title: this.lat+","+this.lng
      };

      // la ubicacion solicitada como parametro en esta funcions
      this.addMarker(markerOptions);

      // para el array de ubicaciones
      // this.markers.forEach(marker=>{
      //   this.addMarker(marker);
      // });

    });
  }

  addMarker(options){
    let markerOptions: MarkerOptions = {
      position: new LatLng(options.position.latitude, options.position.longitude),
      title: options.title
    };
    this.map.addMarker(markerOptions);
    /*this.map.addMarker(markerOptions).then(marker =>{
      this.doGeocode(marker);
    })*/
  }

}
