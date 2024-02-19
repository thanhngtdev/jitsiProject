/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {backToTopAppStack} from '../App';

const Login = () => {
  const [email, onEmail] = React.useState('user1@gmail.com');
  const [password, onPassword] = React.useState('123456');

  const handleLogin = useCallback(() => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        if (userCredential) {
          backToTopAppStack();
        }
      })
      .catch(er => {
        Alert.alert('Wrong');
      });
  }, [email, password]);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 16}}>Login Screen</Text>
      <Text>email</Text>
      <TextInput
        style={styles.input}
        onChangeText={onEmail}
        value={email}
        placeholder="email"
      />
      <Text>password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onPassword}
        value={password}
        placeholder="password"
      />
      <Button title="login" onPress={handleLogin} />
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default Login;
