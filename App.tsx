import React from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
  webClientId: '784124912483-rv3qfle5ona18dn8ujgadj5io705nfm0.apps.googleusercontent.com',
  // webClientId:
  //   '784124912483-abs461p8kl0b98lq7s53pm08cgs3l2oj.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  iosClientId: '784124912483-51uahurhitlvk70ugfo82m9pvnhtp7kb.apps.googleusercontent.com',
});

const App = () => {
  // Somewhere in your code
  const signIn: any = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        console.log('error:' + error);
      }
    }
  };

  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log(appleAuthRequestResponse);
    console.log(appleAuthRequestResponse.user);

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    console.log(credentialState);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{flex: 1}}>
        <View style={{margin: 14}}>
          <Button title="google signin" onPress={() => signIn()}></Button>
        </View>
        <View style={{margin: 14}}>
          <Button title="apple signin" onPress={() => onAppleButtonPress()}></Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
