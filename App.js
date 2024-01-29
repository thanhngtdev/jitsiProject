/* eslint-disable react-native/no-inline-styles */

import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Meeting from './Jitsi';

function HomeScreen({navigation}) {
  const data = [
    {id: 1, room: 'hii', name: 'thanh'},
    {id: 2, room: 'Call', name: 'thanh123'},
    {id: 3, room: 'BCBCB', name: 'thanh1234'},
  ];
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 16}}>Contact list</Text>
      {data?.map((el, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Meeting', {room: el?.room})}
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,

              elevation: 11,
              backgroundColor: '#fff',
              marginBottom: 16,
            }}>
            <Text style={{fontSize: 16}}>{el?.name}</Text>
            <Text>Call</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Meeting" component={Meeting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
