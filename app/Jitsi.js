import {JitsiMeeting} from '@jitsi/react-native-sdk/index';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {PermissionsAndroid, View} from 'react-native';

const Meeting = ({route}) => {
  const [isGranted, setIsGranted] = useState(false);
  const jitsiMeeting = useRef(null);
  console.log('+++++++++++', route);
  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current.close();
  }, []);
  const eventListeners = {
    onReadyToClose,
  };

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
    setIsGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (route?.params?.token) {
      const sendFCMNotification = async () => {
        const url = 'https://fcm.googleapis.com/fcm/send';
        const apiKey =
          'AAAAjuMI6yE:APA91bFa1FD0_XbnkvoMpFNl7XoiDUS0RXfM0fKBRs9XAGqW9ab6uEnbYh5_UEbusq5KR-hfumhBwyg_rFhP484LQmqaJ9RrQyeFbHF1JYwToXWkAch4rb6u6RSo-6Sz1VAts-vo-dPQ';
        const deviceId = route?.params?.token;

        const body = {
          data: {},
          notification: {
            body: {
              groupName: route?.params?.roomName,
              room: route?.params?.room,
              userSender: {},
            },
          },
          android: {
            priority: 'high',
          },
          to: deviceId,
        };

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `key=${apiKey}`,
            },
            body: JSON.stringify(body),
          });

          const responseData = await response.json();
          console.log('FCM Notification sent successfully:', responseData);
        } catch (error) {
          console.error('Error sending FCM Notification:', error);
        }
      };

      // Call the function to send the FCM notification
      sendFCMNotification();
    }
  }, [
    route?.params?.room,
    route?.params?.roomName,
    route?.params?.token,
    route?.params.tokenNotifications,
  ]);

  return (
    <View style={{width: 400, height: 800}}>
      {isGranted && (
        <JitsiMeeting
          eventListeners={eventListeners}
          ref={jitsiMeeting}
          style={{flex: 1}}
          room={route?.params?.room}
          serverURL={'https://vid-dev.digiworkhub.com/'}
        />
      )}
    </View>
  );
};

export default Meeting;
