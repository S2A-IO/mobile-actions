/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file GeolocationService.
 */

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular'
import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()
export class GeolocationService {

  /**
   * The id of the watchPosition interval to clear
   */
  _watchId: any;
  _intervalId: any;
  _currentLocation: any;
  _previousLocation: any;

  /**
   * Initialize a Geolocation service.
   *
   * @constructor
   *
   * @param {Geolocation} geolocation               Geolocation.
   *
   * @returns {undefined} None
   */
  constructor(
    private androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform
  ) {
  }

  /**
   * get Geolocation method.
   *
   * @param {any} options                     The options pass to the geo location service.
   *
   * @returns {Promise} locationPromise       Promise for location
   */
  getlocation( options: any ): any {
    return this.geolocation.getCurrentPosition( options )
    .then( function GetLocation( position ) {
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    });
  }

  /**
   * Watches for changes to the device's current position.
   *
   * @param {any} options                           The options pass to the geo location service.
   * @param {Function} callback                     The custom callback for the geo location service.
   *
   * @returns {Promise} undefined
   */
  watchLocation( options: any, callback: Function ): Promise<any> {
    let me = this;

    let p: Promise<any> = this.platform.is( 'android' ) ? this.checkGPSPermission() : this.locationAccuracy.request( this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY );
    if ( !this.platform.is( 'cordova' ) ) p = Promise.resolve();

    let interval = options.interval;
    let distance = options.distance;
    let distCovered: boolean = true;

    return p.then(() => {
      me.clearWatch();
      me._watchId = me.geolocation.watchPosition( options ).subscribe( function WatchLocation( position ) {
        if ( me.platform.is( 'cordova' ) ) me.backgroundMode.enable();

        if ( me._currentLocation ) me._previousLocation = JSON.parse( JSON.stringify( me._currentLocation ) );
        me._currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        distCovered = me.distanceCovered( me._previousLocation, me._currentLocation, distance );
        if ( interval ) {
          if ( !me._intervalId ) {
            me._intervalId = setInterval(() => {
              distCovered = me.distanceCovered( me._previousLocation, me._currentLocation, distance );
              if ( distCovered ) callback( me._currentLocation );
            }, interval );
            callback( me._currentLocation );
          }
        } else {
          if ( distCovered ) callback( me._currentLocation );
        }
      });
      return Promise.resolve({ status: true });
    }).catch( err => Promise.resolve({ status: false, error: err }));
  }

  /**
   * Stop watching for changes to the device's location referenced by the watchID
   *
   * @param {any} clearBackgroundMode                           The clearBackgroundMode is key to clear app from background mode.
   *
   * @returns {void} undefined
   */
  clearWatch( clearBackgroundMode?: boolean ): void {
    if ( this._watchId ) {
      this._watchId.unsubscribe();
      delete this._watchId;
    }
    if ( this._intervalId ) {
      clearInterval( this._intervalId );
      delete this._intervalId;
    }
    if ( clearBackgroundMode ) this.backgroundMode.disable();
  }

  /**
   * Method to get location permission.
   * If having permission show 'Turn On GPS' dialogue.
   * If not having permission ask for permission
   *
   * @returns {Promise} undefined
   */
  checkGPSPermission(): Promise<any> {
    return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then( result => {
      if ( result.hasPermission ) return this.askToTurnOnGPS();
      else return this.requestGPSPermission();
    }, err => {
      return Promise.reject( err );
    });
  }

  /**
   * Method to get location permission.
   * If having permission show 'Turn On GPS' dialogue.
   * If not having permission ask for permission
   *
   * @returns {Promise} undefined
   */
  requestGPSPermission(): Promise<any> {
    // Show 'GPS Permission Request' dialogue
    return this.androidPermissions.requestPermissions( [ this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ] )
    .then(() => {
      return this.askToTurnOnGPS();
    }, error => {
      console.error('Error requesting location:', error);
      return Promise.reject( error );
    });
  }

  /**
   * If the application is having location access permission then this show GPS turn on dialogue in application.
   *
   * @returns {Promise} undefined
   */
  askToTurnOnGPS(): Promise<any> {
    return this.locationAccuracy.request( this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY ).then(() => {
      return Promise.resolve();
    }, error => {
      console.error('Error requesting location:', error);
      return Promise.reject( error );
    });
  }

  /**
   * Check the distance between two points is greater than specified distance.
   *
   * @param {any} prevLoc                                Previous location or first point
   * @param {any} nextLoc                                Next location or second point
   * @param {number} distance                            Distance in meter
   *
   * @returns {boolean} undefined
   */
  distanceCovered( prevLoc, nextLoc, distance ): boolean {
    if ( distance && typeof google !== 'undefined' && google.maps.geometry && prevLoc ) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng( prevLoc ), new google.maps.LatLng( nextLoc )
      ) >= distance;
    }
    return true;
  }
}
