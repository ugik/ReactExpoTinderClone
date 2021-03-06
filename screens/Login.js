import React from 'react';
import styles from '../styles';
import RootNavigator from '../navigation/RootNavigator';
import { connect } from 'react-redux';
import { login } from '../redux/actions'
import * as firebase from 'firebase';
import firebaseConfig from '../config/firebase.js';
firebase.initializeApp(firebaseConfig);

import { 
  Text, 
  View,
  TouchableOpacity
} from 'react-native';

class Login extends React.Component {
  state = {}

  componentWillMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.props.dispatch(login(user))
        this.setState({ loggedIn: true });
        console.log("loggedIn:" + this.props.loggedIn);
        console.log("We are authenticated now!" + JSON.stringify(user));
      }
    });
  }

  login = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1134770026673925', {
        permissions: ['public_profile'],
      });
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = await firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
//      firebase.auth().signInWithCredential(credential).catch((error) => {
      firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
        // Handle Errors here.
        Alert.alert("Try Again")
      });
    }
  }  

  render() {
    if(this.props.loggedIn){
      return (
        <RootNavigator/>
        )
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.login.bind(this)}>
            <Text>| LogIN |</Text>
          </TouchableOpacity>
          <Text/>
          <TouchableOpacity onPress={() => firebase.auth().signOut()}>
            <Text>| LogOUT |</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

function mapStateToProps(state) {
  console.log("changing state" + state.loggedIn);
  return {
    loggedIn: state.loggedIn
  };
}

export default connect(mapStateToProps)(Login);