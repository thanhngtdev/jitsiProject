import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {DeviceEventEmitter} from 'react-native';
import CallKeep from 'react-native-callkeep';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AddGroup from './app/AddGroup';
import Contact from './app/Contact';
import HomeScreen from './app/Home';
import Meeting from './app/Jitsi';
import Login from './app/LoginScreen';
import NavigationService from './app/NavigationService';
import {notificationHelper} from './app/NotificationHelper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const backToTopAuthStack = () => {
  NavigationService.topLevelNavigator?.dispatch(StackActions.replace('Login'));
};

export const backToTopAppStack = () => {
  NavigationService.topLevelNavigator?.dispatch(StackActions.replace('MyTabs'));
};

function MyTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={'HomeScreen'}
        screenOptions={{
          headerShown: false,
          tabBarAllowFontScaling: false,
          tabBarIconStyle: {display: 'none'},
          tabBarLabelStyle: {paddingBottom: 16},
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Contact" component={Contact} />
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

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
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
          <Stack.Screen
            name="AddGroup"
            component={AddGroup}
            options={{title: 'Add group'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
