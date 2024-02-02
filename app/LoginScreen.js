/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';

const Login = () => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [email, onEmail] = React.useState('');
  const [password, onPassword] = React.useState('');

  const handleLogin = useCallback(() => {
    // signInWithEmailAndPassword(auth, email, password)
    //   .then(userCredential => {
    //     // Signed in
    //     const user = userCredential.user;
    //     // ...
    //     console.log('success', user);
    //     navigate('/');
    //   })
    //   .catch(error => {
    //     Alert.alert('Email hoặc mật khẩu không chính xác!');
    //   })
    //   .finally(() => {});
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 16}}>Login Screen</Text>
      <Text>email</Text>
      <TextInput
        style={styles.input}
        onChangeText={onEmail}
        value={email}
        placeholder="email"
        // keyboardType="numeric"
      />
      <Text>password</Text>
      <TextInput
        style={styles.input}
        onChangeText={onPassword}
        value={password}
        placeholder="password"
        // keyboardType="numeric"
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
