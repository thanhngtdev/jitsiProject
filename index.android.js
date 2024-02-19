import {AppRegistry} from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import {name as appName} from './app.json';
import {DeviceEventEmitter} from 'react-native';
import CallKeep from 'react-native-callkeep';
import NavigationService from './app/NavigationService';

CallKeep.registerPhoneAccount({
  ios: {
    appName: 'YourAppName',
  },
  android: {
    alertTitle: 'Yeu cau quyen',
    alertDescription: 'Quyen cuoc goi!',
    cancelButton: 'Cancel',
    okButton: 'Accept',
    foregroundService: {
      channelId: 'com.jitsiproject',
      channelName: 'JitsiChannel',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  },
});
CallKeep.registerAndroidEvents();
CallKeep.setAvailable(true);
CallKeep.addEventListener('endCall', ({callUUID}) => {
  console.log('End call', callUUID);
});

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: notification => {
    const dataRaw = JSON.parse(notification?.message);
    CallKeep.addEventListener('answerCall', async event => {
      CallKeep.backToForeground();
      if (!notification.foreground) {
        DeviceEventEmitter.addListener('answerCall', navigation => {
          NavigationService.navigate('Meeting', {
            room: dataRaw.room,
            roomName: dataRaw.roomName,
          });
        });
      } else {
        NavigationService.navigate('Meeting', {
          room: dataRaw.room,
          roomName: dataRaw.roomName,
        });
      }
    });
    CallKeep.displayIncomingCall(dataRaw?.groupName, dataRaw?.groupName);
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
