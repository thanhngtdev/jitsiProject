import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Contact from './app/Contact';
import HomeScreen from './app/Home';
import Meeting from './app/Jitsi';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {notificationHelper} from './app/NotificationHelper';
import {usePermissonNoti} from './app/usePermissionNoti';
import CallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';
import {View} from 'react-native';
import NavigationService from './app/NavigationService';
import {Button} from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          // tabBarShowLabel: false,
          headerShown: false,
          tabBarAllowFontScaling: false,
          tabBarIconStyle: {display: 'none'},
          tabBarLabelStyle: {paddingBottom: 16},
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Contact" component={Contact} />
        {/* <Tab.Screen name="Meeting" component={Meeting} /> */}
      </Tab.Navigator>
    </>
  );
}

export const appState = {
  initializeReady: false,
};

function App() {
  const onPermission = React.useCallback(async granted => {
    if (granted) {
      const fcm = await notificationHelper.getDeviceToken();
      console.log('fcm', fcm);
      notificationHelper.listenOnNotification(
        notificationHelper.notificationHandler,
      );
    }
  }, []);

  React.useEffect(() => {
    notificationHelper.askPermissionAndRegisterDeviceToken({
      onPermission: onPermission,
    });
  }, [onPermission]);

  React.useEffect(() => {
    // Configure CallKeep
    CallKeep.setup({
      ios: {
        appName: 'YourAppName',
      },
      android: {
        alertTitle: 'Incoming call',
        alertDescription: 'You have an incoming call!',
        cancelButton: 'Cancel',
        okButton: 'Answer',
      },
    })
      .then(accepted => {
        console.log('accepted--->', accepted);
      })
      .catch(ex => {
        console.log('rejected--->', ex);
      });
    // CallKeep.setAvailable(true);

    // Subscribe to CallKeep events
    CallKeep.addEventListener('answerCall', event => {
      // Handle incoming call
      console.log('Incoming call:', event);
      CallKeep.backToForeground();
      NavigationService.navigate('Meeting');
    });

    // Handle incoming FCM messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message:', remoteMessage);
      CallKeep.displayIncomingCall(
        '1708118d-bade-4ec3-bf0c-15108d3128d8',
        remoteMessage.notification.title,
        remoteMessage.notification.title,
      );
      // Check for call-related data in the FCM message
      // Use the data to trigger CallKeep's displayIncomingCall method
      // Example: CallKeep.displayIncomingCall(remoteMessage.data.uuid, remoteMessage.data.sender, remoteMessage.data.sender);
    });

    // Clean up subscriptions when the component unmounts
    return () => {
      CallKeep.removeEventListener('didReceiveStartCallAction');
      unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        ref={ref => {
          NavigationService.setTopLevelNavigator(ref);
        }}>
        <Stack.Navigator>
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Meeting" component={Meeting} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
