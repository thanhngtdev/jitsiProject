import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {DeviceEventEmitter, Platform} from 'react-native';
import 'react-native-get-random-values';
import PushNotification from 'react-native-push-notification';
import {v4 as uuidv4} from 'uuid';
import {appState} from '../App';
import {notificationHelper} from './NotificationHelper';

export const EmitType = {
  AppReadyForAuth: 'AppReadyForAuth',
  InitializeReady: 'InitializeReady',
};

export default class DefaultNotificationHandler {
  onMessage = notification => {
    this.displayNotification(notification);
  };

  /**
   * when app state is ready
   * process navigation of deeplink
   */
  handleOpenNotification = _notificationOpen => {
    console.log({_notificationOpen});
    const data = _notificationOpen?.data;
    const type = data?.type || '';
    const id = data?.entityId || '';
  };

  onNotificationOpened = (notificationOpen, isForeground) => {
    console.info('Opened Notification: ', notificationOpen);
    console.info('isForeground: ', isForeground);

    /**
     * Using emitter when open notif from background
     * Wait until all setup steps are done
     */
    if (!isForeground) {
      this.subscription?.remove();
      if (appState.initializeReady) {
        // check app state is ready
        this.handleOpenNotification(notificationOpen);
      } else {
        this.subscription = DeviceEventEmitter.addListener(
          EmitType.InitializeReady,
          () => {
            console.info('app init success emit');
            this.handleOpenNotification(notificationOpen);
          },
        );
      }
    } else {
      this.handleOpenNotification(notificationOpen);
    }
  };

  displayNotification = notification => {
    const payload = notification?.data || {};
    const notificationContent = notification?.notification || {};
    console.info('display noti: ', notification);
    if (
      notificationContent &&
      notificationContent.body &&
      notificationContent.title
    ) {
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: uuidv4(),
          body: notificationContent.body,
          title: notificationContent.title,
          userInfo: payload,
        });
      } else {
        PushNotification.presentLocalNotification({
          message: notificationContent.body,
          title: notificationContent.title,
          userInfo: payload,
          channelId: notificationHelper.NOTIFICATION_CHANNEL,
        });
      }
    }
  };
}
