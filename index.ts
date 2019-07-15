/**
 * @author Copyright RIKSOF (Private) Limited.
 *
 * @file All mobile specific actions.
 */

import { ClientActionsDelegate } from '@s2a/mobile';

import { AudioRecordAction } from './record/AudioRecordAction';
import { CameraCaptureAction } from './capture/CameraCaptureAction';
import { RegisterDeviceAction } from './notification/RegisterDeviceAction';
import { ScanBarcodeAction } from './barcode/ScanBarcodeAction';
import { WatchLocationAction } from './geolocation/WatchLocationAction';

import { GeolocationService } from './geolocation/GeolocationService';

class RegisterAction {

  /**
   * Register all actions.
   */
  static all() {
    ClientActionsDelegate.RegisterAction('registerDeviceNotification', RegisterDeviceAction);
    ClientActionsDelegate.RegisterAction('scanBarcode', ScanBarcodeAction);
    ClientActionsDelegate.RegisterAction('audio', AudioRecordAction);
    ClientActionsDelegate.RegisterAction('camera', CameraCaptureAction);
    ClientActionsDelegate.RegisterAction('watchlocation', WatchLocationAction);
  }
}

export {
  // actions
  AudioRecordAction,
  CameraCaptureAction,
  RegisterDeviceAction,
  ScanBarcodeAction,
  WatchLocationAction,

  // services
  GeolocationService,

  RegisterAction
};
