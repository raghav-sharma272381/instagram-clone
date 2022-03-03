import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    if (text.length > 0) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .add({
          creator: firebase.auth().currentUser.uid,
          text,
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={{ padding: 10, flexDirection: "row", flex: 1 }}>
            <Icon
              style={{ paddingHorizontal: 5 }}
              color="black"
              name="account-circle-outline"
              size={25}
            />
            {item.user !== undefined ? (
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {item.user.username}
              </Text>
            ) : null}
            <Text style={{ fontSize: 18 }}> {item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={"padding"} style={{ marginBottom: 20 }}>
        <TextInput
          style={styles.textinput}
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <View style={styles.appButtonContainer}>
          <Text style={styles.Button} onPress={() => onCommentSend()}>
            Post
          </Text>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

const styles = StyleSheet.create({
  textinput: {
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 18,
  },
  Button: {
    fontSize: 25,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1B98F5",
    borderRadius: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

export default connect(mapStateToProps, mapDispatchProps)(Comment);
