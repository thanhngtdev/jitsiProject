/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {notificationHelper} from './app/NotificationHelper';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: notification => {
    // process the notification
    if (
      notification.userInteraction &&
      notificationHelper.notificationHandler.onNotificationOpened
    ) {
      notificationHelper.notificationHandler.onNotificationOpened(
        notification,
        notification.foreground,
      );
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: false,
});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNCallKeepBackgroundMessage',
  () =>
    ({name, callUUID, handle}) => {
      // Make your call here

      return Promise.resolve();
    },
);
