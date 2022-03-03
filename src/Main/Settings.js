import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import firebase from "firebase";
require("firebase/firestore");

function SettingScreen(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("user")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("user does not exist in render");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          if (posts.length > 0) {
            setUserPosts(posts);
          } else {
            setUserPosts([]);
          }
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following]);
  if (user === null) {
    return <View></View>;
  }
  const onFollow = () => {
    firebase
      .firestore()
      .collection("Following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("Following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", margin: 10 }}>
        <Icon
          style={{ paddingHorizontal: 5 }}
          color="black"
          name="account-circle-outline"
          size={60}
        />
        <View style={styles.containerInfo}>
          <Text style={{ fontSize: 20 }}>{user.username}</Text>
          <Text>{user.email}</Text>
          {props.route.params.uid != firebase.auth().currentUser.uid ? (
            <View>
              {following ? (
                <Button title="Following" onPress={() => onUnfollow()} />
              ) : (
                <Button title="Follow" onPress={() => onFollow()} />
              )}
            </View>
          ) : (
            <Button
              onPress={() => {
                firebase.auth().signOut();
              }}
              title="Logout"
            />
          )}
        </View>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <TouchableOpacity>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 10,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
    padding: 2,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});
export default connect(mapStateToProps, null)(SettingScreen);
