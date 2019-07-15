/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Get record audio action.
 */

import { IClientAction } from '@s2a/mobile';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

const DEFAULT_LIMIT = 1;

export class AudioRecordAction extends IClientAction {

  /**
   * Audio record does not depend on the number of documents being processed.
   *
   * @returns {boolean} p                   Whether we should loop for document.
   */
  loop() {
    return false;
  }

  /**
   * Initialize a record audio action instance.
   *
   * @returns {undefined} None
   */
  constructor() {
    super();
    this._mediaCapture = new MediaCapture();
  }

  /**
   * Executes the record audio action.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {IActionParams} params      Params to use for execution.
   * @param {any} extras                Extras based on the environment.
   *
   * @returns {any} p                   Promise for action completion.
   */
  exec( doc, params, extras ) {
    return this.captureAudio( doc, params.key, params.options );
  }

  /**
   * Executes the record audio action.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {string} key                The key to hold file Object in user doc.
   * @param {any} options               The options.
   *
   * @returns {any} p                   Promise for action completion.
   */
  captureAudio( doc, key, options ) {
    let me = this;

    // Create options for the audio.
    let audioOptions = {
      limit: DEFAULT_LIMIT
    };

    audioOptions = Object.assign( audioOptions, options );

    // Get the data.
    return this._mediaCapture.captureAudio( audioOptions )
      .then( function AfterMediaFile( mediafile ) {

      if ( audioOptions.limit === 1 ) return me.setKeyValue( doc, key, mediafile[0] );
      return me.setKeyValue( doc, key, mediafile );
    });
  }
}
