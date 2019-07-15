/**
 * @author Copyright RIKSOF (Private).
 *
 * @file Action to get geolocation.
 */
import { IClientAction } from '@s2a/mobile';
import { GeolocationService } from './GeolocationService';
import { JitNotifications } from 'jit/client';

const DATA_KEY = 'data';
const CLEAR_BACKGROUND_MODE = true;

export class WatchLocationAction extends IClientAction {

  /**
   * Executes the geolocation action.
   *
   * @param {any} doc                         Document to perform action on.
   * @param {IActionParams} params      Params to use for execution.
   * @param {any} extras                      Extras based on the environment.
   *
   * @returns {any} p                         Promise for action completion.
   */
  exec( doc: any, params: any, extras: any ): any {
    if ( params.disable == true ) return this.clearWatch( doc, extras.geolocation );
    return this.watchLocation( doc, params.key, params.options, params.owner, params.branch,
      params.reference, params.groups, extras.currentUser, extras.notifier, extras.geolocation );
  }

  /**
   * Watches for changes to the device's current position.
   *
   * @param {any} doc                             Document.
   * @param {string} key                          The key to hold location value in doc.
   * @param {any} options                         The options pass to the geo location service.
   * @param {string} owner                        Owner for the notification.
   * @param {string} branch                       Branch for the notification.
   * @param {string} ref                          Reference for notification.
   * @param {string[]} groups                     Groups to be notified.
   * @param {string} sender                       Sender for this notification.
   * @param {JitNotifications} notifier           Notification service.
   * @param {GeolocationService} geo              Geolocation service.
   *
   * @returns {any} doc                           Document.
   */
  watchLocation( doc: any, key: string, options: any, owner, branch, ref: string, groups: string[],
  sender: string, notifier: JitNotifications, geolocation: GeolocationService ) {
    let me = this;
    return geolocation.watchLocation( options, function GeolocationCallback( position ) {
      if ( position.lat && position.lng ) {
        me.setKeyValue( doc, key, position );
        if ( options.data ) me.setKeyValue( doc, DATA_KEY, options.data );
        notifier.notify( owner, branch, ref, { doc: doc }, null, sender, groups );
     //    if ( typeof document !== undefined && document.getElementById('updateLoc') ) {
     //   document.getElementById('updateLoc').innerHTML = JSON.stringify( position );
     //   document.getElementById('updateLoc').click();
     // }

      }
    }).then(result => {
      me.setKeyValue( doc, key, result );
      return doc;
    });
  }

  /**
   * Stop watching for changes to the device's location.
   *
   * @returns {any} doc                           Document.
   */
  clearWatch( doc: any, geolocation: GeolocationService ) {
    geolocation.clearWatch( CLEAR_BACKGROUND_MODE );
    return doc
  }
}
