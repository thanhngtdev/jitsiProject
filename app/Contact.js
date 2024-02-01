/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {PhoneCall} from 'phosphor-react-native';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import NavigationService from './NavigationService';

const Contact = () => {
  const [listData, setListData] = useState([]);
  const db = firestore();
  const navigation = useNavigation();

  useEffect(() => {
    const usersCollection = firestore()
      .collection('contact')
      .get()
      .then(res => {
        // console.log('reres', res.docs);

        // res.docs.forEach(doc => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, ' => ', doc.data());
        setListData(res.docs);
        // });
      });
  }, [db]);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <Text style={{marginVertical: 16}}>Contact list</Text>
      {listData?.map((el, index) => {
        console.log('el', el.data());
        return (
          <TouchableOpacity
            key={index}
            onPress={() =>
              NavigationService.navigate('Meeting', {room: el.data()?.roomName})
            }
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.2,
              shadowRadius: 6.68,

              elevation: 11,
              backgroundColor: '#fff',
              marginBottom: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'red',
                  marginRight: 8,
                  borderRadius: 40,
                }}
                source={{
                  uri: 'https://unsplash.com/photos/a-beach-with-palm-trees-and-water-PUPSUR3RVqY',
                }}
              />
              <Text style={{fontSize: 16}}>{el.data()?.name}</Text>
            </View>
            <PhoneCall size={26} weight="regular" />
            {/* <Text>Call</Text> */}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Contact;
