import React, { Component } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollowing,
} from "../../redux/actions/index";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from "./HomeScreen";
import Settings from "./Settings";
import Explore from "./Explore";
import Following from "./Following";
import Add from "./Add";
import Post from "./Post";
import Comments from "./Comments";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

class Bottom extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName={HomeScreen}
        labeled={false}
        barStyle={{ backgroundColor: "#F5F5F5" }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={Explore}
          navigation={this.props.navigation}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="AddContainer"
          component={Add}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Following"
          component={Following}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="heart-outline"
                color={color}
                size={27}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-cowboy-hat"
                color={color}
                size={30}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
  }
  render() {
    const { currentUser } = this.props;
    if (currentUser == undefined) {
      return <View style={{ flex: 1, justifyContent: "center" }}></View>;
    } else
      return (
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Bottom}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="Comments" component={Comments} />
          </Stack.Navigator>
        </NavigationContainer>
      );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollowing },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
