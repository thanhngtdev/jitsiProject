import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const usePermissonNoti = () => {
  const [hasNotiPermission, setHasNotiPermission] = useState(false);

  const notiAlert = useCallback(() => {
    Alert.alert('No permission', '', [
      {text: 'close'},
      {text: 'Go to setting', onPress: () => Linking.openSettings()},
    ]);
  }, []);

  const promptPermission = useCallback(
    async onGranted => {
      let isGranted = false;
      // check permission
      if (Platform.OS === 'android') {
        const version = await DeviceInfo.getApiLevel();
        const authStatus = await messaging().hasPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        isGranted = Boolean(enabled);
        setHasNotiPermission(isGranted);
        if (version < 33 && !isGranted) {
          notiAlert();
        }
        if (isGranted) {
          onGranted && onGranted();
        }
      } else {
        // const promiseResult = new Promise((resolve, reject) => {
        //   PushNotificationIOS.checkPermissions(premission => {
        //     if (premission?.authorizationStatus == 2) {
        //       isGranted = true;
        //       resolve(true);
        //       return;
        //     }
        //     resolve(false);
        //   });
        // });
        // const isGrantedRespone = await promiseResult;
        // setHasNotiPermission(isGrantedRespone);
        // if (isGranted) {
        //   onGranted && onGranted();
        // }
      }

      if (Platform.OS === 'android') {
        // const result = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        // );

        const version = await DeviceInfo.getApiLevel();
        console.log('result', version);
        // if (result === 'granted') {
        //   onGranted && onGranted();
        //   setHasNotiPermission(true);
        //   return;
        // } else {
        //   if (version >= 33) {
        //     notiAlert();
        //   }
        // }
      } else {
      }
    },
    [notiAlert],
  );

  useEffect(() => {
    promptPermission();
  }, [promptPermission]);

  return {
    hasNotiPermission,
    promptPermission,
    notiAlert,
  };
};
