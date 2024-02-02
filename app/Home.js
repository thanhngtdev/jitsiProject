/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter, Text, TouchableOpacity, View} from 'react-native';
// import {collection, getDocs, query, where} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import CallKeep from 'react-native-callkeep';
import NavigationService from './NavigationService';

const HomeScreen = () => {
  const db = firestore();

  const [listGroup, setListGroup] = useState([]);
  const navigation = useNavigation();
  React.useEffect(() => {
    DeviceEventEmitter.emit('answerCall', NavigationService);
  }, []);
  useEffect(() => {
    const usersCollection = firestore()
      .collection('group')
      .get()
      .then(res => {
        setListGroup(res.docs);
        // console.log('reres', res.docs);
        // res.docs.forEach(doc => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, ' => ', doc.data());
        // });
      });
  }, [db]);
  const onStartCallPress = () => {
    // Initiate an outgoing call
    CallKeep.displayIncomingCall('uuid', 'John Doe', 'John Doe');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 16}}>Contact list</Text>
      <TouchableOpacity onPress={onStartCallPress}>
        <Text>Start Call</Text>
      </TouchableOpacity>
      {listGroup?.map((el, index) => {
        console.log('el', el);
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
};

export default HomeScreen;
