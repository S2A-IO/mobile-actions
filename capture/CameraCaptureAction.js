/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Get camera picture action.
 */
import { IClientAction } from '@s2a/mobile';

import { Camera } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

const BASE64_PREFIX = 'data:image/jpeg;base64,';
const DEFAULT_LIMIT = 1;

export class CameraCaptureAction extends IClientAction {

  /**
   * Camera does not depend on the number of documents being processed.
   *
   * @returns {boolean} p                   Whether we should loop for document.
   */
  loop() {
    return false;
  }

  /**
   * Initialize a camera and base64 action instance.
   *
   * @returns {undefined} None
   */
  constructor() {
    super()
    this._camera = new Camera();
    this._mediaCapture = new MediaCapture();
  }

  /**
   * Executes the camera action.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {IActionParams} params      Params to use for execution.
   * @param {any} extras                Extras based on the environment.
   *
   * @returns {any} p                   Promise for action completion.
   */
  exec( doc, params, extras ) {
    return this.takeMedia( doc, params.key, params.options );
  }

  /**
   * Executes the camera action.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {string} key                The key to hold file Object in user doc.
   * @param {any} options               The options.
   *
   * @returns {any} p                   Promise for action completion.
   */
  takeMedia( doc, key, options ) {
    let me = this;

    // Get the media data
    if ( options.mediaType == this._camera.MediaType.VIDEO && options.sourceType == this._camera.PictureSourceType.CAMERA ) {
      let videoOptions = {
        limit: DEFAULT_LIMIT
      };
      videoOptions = Object.assign( videoOptions, options );
      return this._mediaCapture.captureVideo( videoOptions ).then( function AfterMediaFile( mediafile ) {
        if ( videoOptions.limit === 1 ) return me.setKeyValue( doc, key, mediafile[0] );
        return me.setKeyValue( doc, key, mediafile );
      });
    } else {
      return this._camera.getPicture( options ).then( function AfterImageFile( imageData ) {
        if ( options.destinationType == me._camera.DestinationType.DATA_URL ) {
          imageData = BASE64_PREFIX + imageData;
        }
        return me.setKeyValue( doc, key, imageData );
      });
    }
  }
}
