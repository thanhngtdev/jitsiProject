import {JitsiMeeting} from '@jitsi/react-native-sdk/index';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {PermissionsAndroid, View} from 'react-native';

const Meeting = ({route}) => {
  const [isGranted, setIsGranted] = useState(false);
  console.log('route', route);
  const jitsiMeeting = useRef(null);
  // const navigation = useNavigation();

  // const { room } = route.params;

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

  return (
    <View style={{width: 400, height: 800}}>
      {isGranted && (
        <JitsiMeeting
          eventListeners={eventListeners}
          ref={jitsiMeeting}
          style={{flex: 1}}
          room={'test123'}
          serverURL={'https://vid-dev.digiworkhub.com/'}
        />
      )}
    </View>
  );
};

export default Meeting;
