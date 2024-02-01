import messaging from '@react-native-firebase/messaging';
import {syncUniqueId} from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import DefaultNotificationHandler from './notificationHandler';

class NotificationHelper {
  notificationHandler;
  NOTIFICATION_CHANNEL = 'JitsiChannel';

  constructor() {
    this.notificationHandler = new DefaultNotificationHandler();
    this.createDefaultChannel();
  }

  createDefaultChannel = async () => {
    try {
      const deviceId = await syncUniqueId();

      PushNotification.channelExists(this.NOTIFICATION_CHANNEL, exists => {
        console.info('channel exists: ', exists);
        if (exists) {
          return;
        }

        PushNotification.createChannel(
          {
            channelId: this.NOTIFICATION_CHANNEL,
            channelName: this.NOTIFICATION_CHANNEL,
          },
          created => {
            console.info(`Created channel ${deviceId}: `, created);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  askPermissionAndRegisterDeviceToken = async (
    permissionCallback,
    deviceTokenCallBack,
  ) => {
    try {
      const granted = await messaging().requestPermission();
      const enabled =
        granted === messaging.AuthorizationStatus.AUTHORIZED ||
        granted === messaging.AuthorizationStatus.PROVISIONAL;
      if (permissionCallback) {
        permissionCallback.onPermission(enabled);
      }
    } catch (error) {
      if (permissionCallback) {
        permissionCallback.onPermission(false);
      }
    }
  };

  hasPermission = () => messaging().hasPermission();
  getDeviceToken = async () => {
    return await messaging().getToken();
  };

  registerUserTopic = async userId => {
    const granted = await messaging().hasPermission();
    if (granted) {
      messaging()
        .subscribeToTopic(userId)
        .then(() => {
          console.info('subscribe to topic: ', userId);
        })
        .catch(error => {
          console.warn('subscribe topic error: ', error);
        });
    }
  };

  unregisterUserTopic = userId => {
    messaging()
      .unsubscribeFromTopic(userId)
      .then(() => console.info('unsubscribe topic: ', userId))
      .catch(console.warn);
  };

  listenOnNotification = async notificationHandler => {
    try {
      const granted = await messaging().hasPermission();
      console.info('receive remote granted: ', granted);
      if (granted) {
        // user has permissions
        this.detachListeners();
        this.onMessageListener = messaging().onMessage(notification => {
          // Process your notification as required
          console.info('receive remote notification: ', notification);
          notificationHandler.onMessage(notification);
        });
      }
    } catch (error) {
      console.warn('error', error);
    }
  };

  detachListeners = () => {
    if (
      this.onMessageListener &&
      typeof this.onMessageListener === 'function'
    ) {
      this.onMessageListener();
    }
  };
}

export const notificationHelper = new NotificationHelper();
