import React, {useCallback, useRef} from 'react';

import {JitsiMeeting} from '@jitsi/react-native-sdk/index';

import {View} from 'react-native';

interface MeetingProps {
  route: any;
}

const Meeting = ({route}: MeetingProps) => {
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

  return (
    <View style={{width: 400, height: 800}}>
      <JitsiMeeting
        eventListeners={eventListeners}
        ref={jitsiMeeting}
        style={{flex: 1}}
        room={route?.params?.room}
        serverURL={'https://vid-dev.digiworkhub.com/'}
      />
    </View>
  );
};

export default Meeting;
