/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file Scan barcode or qrcode action.
 */
import { IClientAction } from '@s2a/mobile';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

export class ScanBarcodeAction extends IClientAction {
  private barcodeScanner: BarcodeScanner;

  /**
   * Scan does not depend on the number of documents being processed.
   *
   * @returns {boolean} p                   Whether we should loop for document.
   */
  loop(): boolean {
    return false;
  }

  /**
   * Initialize a barcode scanner service action instance.
   *
   * @returns {undefined} None
   */
  constructor() {
    super();
    this.barcodeScanner = new BarcodeScanner();
  }

  /**
   * Executes the barcode action.
   *
   * @param {any} doc                   Document to perform action on.
   * @param {IActionParams} params      Params to use for execution.
   * @param {any} extras                Extras based on the environment.
   *
   * @returns {any} p                   Promise for action completion.
   */
  exec( doc: any, params: any, extras: any ): any {
    return this.scan( doc, params.key, params.options );
  }

  /**
   * Scan a barcode, returning the data back to you.
   *
   * @param {any} doc                             User information.
   * @param {string} key                          The key to hold barcode value in user doc.
   * @param {BarcodeScannerOptions} options       The optional options to pass to the scanner.
   *
   * @returns {Promise} p                         Promise for document.
   */
  scan( doc: any, key: string, options: BarcodeScannerOptions ) {
    let me = this;
    return this.barcodeScanner.scan(options).then( function AfterScan( barcode ) {
      return me.setKeyValue( doc, key, barcode.text );
    });
  }
}
