import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {DeviceEventEmitter, NativeEventEmitter} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Contact from './app/Contact';
import HomeScreen from './app/Home';
import Meeting from './app/Jitsi';
import NavigationService from './app/NavigationService';
import {notificationHelper} from './app/NotificationHelper';
import CallKeep from 'react-native-callkeep';
import Login from './app/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={'HomeScreen'}
        screenOptions={{
          // tabBarShowLabel: false,
          headerShown: false,
          tabBarAllowFontScaling: false,
          tabBarIconStyle: {display: 'none'},
          tabBarLabelStyle: {paddingBottom: 16},
        }}>
        {/* <Tab.Screen name="Login" component={Login} /> */}
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
    CallKeep.setup({
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
    })
      .then(accepted => {
        console.log('accepted--->', accepted);
      })
      .catch(ex => {
        console.log('rejected--->', ex);
      });
  }, []);

  React.useEffect(() => {
    notificationHelper.askPermissionAndRegisterDeviceToken({
      onPermission: onPermission,
    });
  }, [onPermission]);

  // React.useEffect(() => {
  //   // Configure CallKeep
  //   // Subscribe to CallKeep events
  //   CallKeep.addEventListener('answerCall', event => {
  //     // Handle incoming call
  //     console.log('Incoming call:', event);
  //     CallKeep.backToForeground();
  //     NavigationService.navigate('Meeting');
  //   });

  //   // Handle incoming FCM messages
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('FCM Message:', remoteMessage);
  //     CallKeep.displayIncomingCall(
  //       '1708118d-bade-4ec3-bf0c-15108d3128d8',
  //       remoteMessage.notification.title,
  //       remoteMessage.notification.title,
  //     );
  //     // Check for call-related data in the FCM message
  //     // Use the data to trigger CallKeep's displayIncomingCall method
  //     // Example: CallKeep.displayIncomingCall(remoteMessage.data.uuid, remoteMessage.data.sender, remoteMessage.data.sender);
  //   });

  //   const backgroundMessageHandler = messaging().setBackgroundMessageHandler(
  //     async remoteMessage => {
  //       CallKeep.addEventListener('answerCall', event => {
  //         // Handle incoming call
  //         console.log('Incoming call:', event);
  //         CallKeep.backToForeground();
  //         NavigationService.navigate('Meeting');
  //       });
  //       CallKeep.displayIncomingCall(
  //         '1708118d-bade-4ec3-bf0c-15108d3128d8',
  //         '1708118d-bade-4ec3-bf0c-15108d3128d8',
  //         'background appjs',
  //       );
  //     },
  //   );

  //   // Clean up subscriptions when the component unmounts
  //   return () => {
  //     CallKeep.removeEventListener('didReceiveStartCallAction');
  //     unsubscribe();
  //     backgroundMessageHandler();
  //   };
  // }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        // linking={linking}
        ref={ref => {
          NavigationService.setTopLevelNavigator(ref);
        }}
        onReady={() => {
          DeviceEventEmitter.emit('answerCall', NavigationService);
        }}>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Meeting" component={Meeting} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
