import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, Marker } from '@ionic-native/google-maps';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  map: GoogleMap;
  lat: number;
  long: number;

  loading: boolean;
  error: boolean;

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, public geolocation: Geolocation) {
    console.log('Map');
    this.loading = true;
    this.error = false;
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    }, (err) => {
      console.log('Error current position');
      console.log(JSON.stringify(err));
      this.error = true;
      this.loading = false;
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.lat, // default location
          lng: this.long // default location
        },
        zoom: 18
      },
      controls: {
        myLocationButton: true,
        zoom: true
      }
    };

    this.map = GoogleMaps.create('canv_map', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      alert('map ready');
      // Now you can use all methods safely.
      this.getPosition();
      this.loading = false;
      this.error = false;
    })
    .catch(error =>{
      alert('error map ready');
      console.log(error);
    });

  }

  getPosition() {

    let markerIcon = {
        url: "assets/imgs/checkpoint.png",
        size: {
            width: 60,
            height: 60,
        }
    }

    this.map.moveCamera({
      target: {lat: this.lat, lng: this.long}
    }).then(() => {
      return this.map.addMarker({
        title: ' Wrong Way',
        snippet: ' Un lugar fantástico',
        icon: markerIcon,
        animation: 'DROP',
        position: {lat: this.lat, lng: this.long}
      });
    }).then((marker: Marker) => {
      marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
        alert('click marker');
      });
    });

  }

}
