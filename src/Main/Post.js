import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function Post(props, { navigation }) {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.navigate("Home");
      });
  };
  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} style={{ flex: 1 }} />
      <KeyboardAvoidingView behavior={"padding"} style={{ paddingBottom: 20 }}>
        <TextInput
          style={styles.textinput}
          placeholder="Write a caption..."
          onChangeText={(caption) => setCaption(caption)}
        />

        <Text style={styles.Button} onPress={() => uploadImage()}>
          Post
        </Text>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textinput: {
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 18,
  },
  Button: {
    fontSize: 25,
    textAlign: "center",

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

export default Post;
