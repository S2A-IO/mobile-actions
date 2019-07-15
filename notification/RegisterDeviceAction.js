/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Action to Register Device for push notification service.
 */
import { IClientAction } from '@s2a/mobile';
import { FCM } from '@ionic-native/fcm/ngx';

const KEY_ERROR_MESSAGE = 'Error with Push plugin';

export class RegisterDeviceAction extends IClientAction {

  /**
   * Register device does not depend on the number of documents being processed.
   *
   * @returns {boolean} p                   Whether we should loop for document.
   */
  loop() {
    return false;
  }

  /**
   * Initialize a register device for push notification service.
   *
   * @returns {undefined} None
   */
  constructor() {
    super();
    this.fcm = new FCM();
  }

  /**
   * Executes the register device for push notification.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {IActionParams} params      Params to use for execution.
   * @param {any} extras                Extras based on the environment.
   *
   * @returns {any} p                   Promise for action completion.
   */
  exec(doc, params, extras) {
    return this.register( doc, params.key );
  }

  /**
   * Register device for push, returning the data back to you.
   *
   * @param {any} doc                             User information.
   * @param {string} key                          The key to hold device id value in user doc.
   *
   * @returns {Promise} p                         Promise for document.
   */
  register( doc, key ) {
    let me = this;
    return this.fcm.getToken().then( function DeviceRegistered( token ) {
      return me.setKeyValue( doc, key, token);
    }).catch( function PushNotificationTokenError( error ) {
      console.error( KEY_ERROR_MESSAGE, error );
      return doc;
    });
  }
}
