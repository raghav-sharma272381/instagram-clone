import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Explore(props) {
  const [users, setUsers] = useState([]);

  const fetchUser = (search) => {
    firebase
      .firestore()
      .collection("user")
      .where("username", ">=", search)
      .get()
      .then((snapshot) => {
        let user = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(user);
      });
  };
  return (
    <View>
      <TextInput
        style={{ fontSize: 30, borderWidth: 1 }}
        onChangeText={(search) => fetchUser(search)}
        autoCorrect={false}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Settings", { uid: item.id })
            }
          >
            <View
              style={{
                padding: 5,
                fontSize: 20,
                borderWidth: 0.25,
                flexDirection: "row",
              }}
            >
              <Icon
                style={{ paddingHorizontal: 5 }}
                color="black"
                name="account-circle-outline"
                size={30}
              />
              <Text
                style={{
                  fontSize: 30,
                }}
              >
                {item.username}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Explore;
