/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Button,
  DeviceEventEmitter,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {collection, getDocs, query, where} from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Plus} from 'phosphor-react-native';
import {useCallback} from 'react';
import {backToTopAuthStack} from '../App';
import NavigationService from './NavigationService';
import {notificationHelper} from './NotificationHelper';

const HomeScreen = () => {
  const db = firestore();
  const currentUser = auth().currentUser;
  if (currentUser) {
    console.log('User ID:', currentUser.uid);
    console.log('Email:', currentUser.email);
    console.log('Display Name:', currentUser.displayName);
    console.log('Photo URL:', currentUser.photoURL);
  } else {
    console.log('No user is currently logged in.');
  }

  const [listGroup, setListGroup] = useState([]);
  const navigation = useNavigation();
  React.useEffect(() => {
    DeviceEventEmitter.emit('answerCall', NavigationService);
  }, []);

  // Hàm để cập nhật dữ liệu trong collection 'contact'
  const updateContactData = async (contactId, newData) => {
    try {
      // Thực hiện truy vấn để cập nhật dữ liệu trong collection
      await firestore().collection('contact').doc(contactId).update(newData);

      console.log('Dữ liệu đã được cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật dữ liệu:', error);
    }
  };

  const getToken = async () => {
    const fcm = await notificationHelper.getDeviceToken();
    return fcm;
  };

  console.log(getToken(), 'getTokengetToken');

  useEffect(() => {
    const contactCollection = firestore()
      .collection('contact')
      .get()
      .then(async res => {
        const dataContact = res.docs?.map(e => {
          return {
            id: e.id,
            data: e.data(),
          };
        });

        const currentUserData = dataContact?.find(
          e => e?.data?.email === currentUser.email,
        );
        console.log(currentUserData, 'currentUserData');
        const token = await getToken();
        console.log(token, 'tokentokentokentoken');
        updateContactData(currentUserData.id, {
          ...currentUserData.data,
          tokenNotifications: token,
        });
      });
  }, [currentUser.email]);

  useEffect(() => {
    const usersCollection = firestore()
      .collection('group')
      .get()
      .then(res => {
        setListGroup(res.docs);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const usersCollection = firestore()
        .collection('group')
        .get()
        .then(res => {
          setListGroup(res.docs);
        });
    }, []),
  );

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{marginVertical: 16}}>Contact group</Text>
        <TouchableOpacity
          onPress={() => NavigationService.navigate('AddGroup')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{textAlign: 'center'}}>Contact group</Text>
          <Plus size={12} />
        </TouchableOpacity>
      </View>
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
      <Button
        title="logout"
        onPress={() => {
          auth()
            .signOut()
            .then(res => {
              console.log('res', res);
              backToTopAuthStack();
            });
        }}
      />
    </ScrollView>
  );
};

export default HomeScreen;
