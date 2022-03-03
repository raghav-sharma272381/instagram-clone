import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function HomeScreen(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (
      props.usersLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.usersLoaded, props.feed]);

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <View style={styles.TextContainerTop}>
                <Icon
                  style={{ paddingHorizontal: 5 }}
                  color="black"
                  name="account-circle-outline"
                  size={32}
                />
                <Text style={{ fontSize: 25 }}>{item.user.username}</Text>
              </View>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <View style={{ padding: 10, flexDirection: "row" }}>
                <Icon
                  style={{ paddingHorizontal: 5 }}
                  color={"grey"}
                  name="heart-outline"
                  size={35}
                />
                <Icon
                  onPress={() =>
                    props.navigation.navigate("Comments", {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                  style={{ paddingHorizontal: 5 }}
                  color="grey"
                  name="chat-outline"
                  size={35}
                />
                <Icon
                  style={{ paddingHorizontal: 5 }}
                  color="grey"
                  name="near-me"
                  size={35}
                />
              </View>
              <Text style={styles.TextContainer}>{item.caption}</Text>
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

    fontSize: 20,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
    marginVertical: 15,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  TextContainer: {
    flex: 1,
    padding: 10,
    fontSize: 20,
  },
  TextContainerTop: {
    flex: 1,
    padding: 10,

    borderWidth: 1,
    borderColor: "grey",
    flexDirection: "row",
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersLoaded: store.usersState.usersLoaded,
});
export default connect(mapStateToProps, null)(HomeScreen);
