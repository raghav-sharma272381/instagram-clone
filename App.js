import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/Auth/Login";
import Signin from "./src/Auth/Signin";
import * as firebase from "firebase";
import { View, Text } from "react-native";
import MainScreen from "./src/Main/Main";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers";
const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
  apiKey: "AIzaSyB9enDmtaiBB0R4xSVorSAXxmcVThTj2Ys",
  authDomain: "instagram-app-3053e.firebaseapp.com",
  projectId: "instagram-app-3053e",
  storageBucket: "instagram-app-3053e.appspot.com",
  messagingSenderId: "991604083993",
  appId: "1:991604083993:web:500540572de911bc508988",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const Stack = createStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true, loaded: true });
      } else {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 30 }}>Loading</Text>
        </View>
      );
    } else if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Signin">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else if (loggedIn) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Instagram" component={MainScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }
  }
}

const render = () => {
  return <App />;
};

export default render;
