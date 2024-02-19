/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AddGroup = () => {
  const currentUser = auth().currentUser;
  console.log('currentUser', currentUser);
  const navigation = useNavigation();
  const [listGroup, setListGroup] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [userNameCurr, setNameCurrent] = useState('');
  console.log('selectedIndices', selectedIndices);

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
        setNameCurrent(currentUserData);
        const filteredData = dataContact.filter(
          contact => contact.data?.email !== currentUser.email,
        );
        console.log('filteredData', filteredData);
        setListGroup(filteredData);
      });
  }, [currentUser.email]);

  const handlePress = item => {
    setSelectedIndices(prevSelectedIndices => {
      const isSelected = prevSelectedIndices.includes(item?.id);
      if (isSelected) {
        return prevSelectedIndices.filter(i => i?.id !== item?.id);
      } else {
        return [...prevSelectedIndices, item];
      }
    });
  };
  const addCollection = id => {
    firestore()
      .collection('group')
      .add({
        groupName: [userNameCurr, ...selectedIndices]
          ?.map(e => e?.data?.name)
          ?.join(', '),
        data: [userNameCurr, ...selectedIndices],
      })
      .then(() => {
        console.log('User added!');
        navigation.goBack();
      });
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <View style={{marginTop: 16}}>
        {listGroup?.map((el, ind) => {
          return (
            <TouchableOpacity
              key={ind}
              onPress={() => handlePress(el)}
              style={[
                styles.item,
                selectedIndices.some(e => e?.id === el?.id) &&
                  styles.selectedItem,
              ]}>
              <Text>{el?.data?.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Button title="Save" onPress={addCollection} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
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
  },
  selectedItem: {
    backgroundColor: 'lightblue',
  },
});
export default AddGroup;
