/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file GeolocationService.
 */

import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

export class GeolocationService {

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
  ) {
    this.geolocation = new Geolocation();
  }

  /**
   * get Geolocation method.
   *
   * @param {any} options                     The options pass to the geo location service.
   *
   * @returns {Promise} locationPromise       Promise for location
   */
  getlocation( options ) {
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
  watchLocation( options, callback ) {
    let me = this;

    let p = Promise.resolve();

    let interval = options.interval;
    let distance = options.distance;
    let distCovered = true;

    return p.then(() => {
      me.clearWatch();
      me._watchId = me.geolocation.watchPosition( options ).subscribe( function WatchLocation( position ) {
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
  clearWatch( clearBackgroundMode ) {
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
   * Check the distance between two points is greater than specified distance.
   *
   * @param {any} prevLoc                                Previous location or first point
   * @param {any} nextLoc                                Next location or second point
   * @param {number} distance                            Distance in meter
   *
   * @returns {boolean} undefined
   */
  distanceCovered( prevLoc, nextLoc, distance ) {
    if ( distance && typeof google !== 'undefined' && google.maps.geometry && prevLoc ) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng( prevLoc ), new google.maps.LatLng( nextLoc )
      ) >= distance;
    }
    return true;
  }
}
