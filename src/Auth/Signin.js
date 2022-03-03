import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import firebase from "firebase";

class Singin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      username: "",
    };

    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { email, password, username } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("user")
          .doc(firebase.auth().currentUser.uid)
          .set({ username, email });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
        <Text style={styles.Header}>Instagram</Text>

        <Text style={styles.SHeader}>E-mail</Text>
        <TextInput
          style={styles.input}
          onChangeText={(email) => this.setState({ email })}
        />

        <Text style={styles.SHeader}>Username</Text>
        <TextInput
          style={styles.input}
          onChangeText={(username) => this.setState({ username })}
        />
        <Text style={styles.SHeader}>Password</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => this.onSignUp()}>
          <Text style={styles.button}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={{ fontSize: 17, marginTop: 10, color: "#0000FF" }}>
            Log in insted ?
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  button: {
    fontSize: 30,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#5DA3FA",
    textAlign: "center",
    marginTop: 20,

    color: "#fff",
  },
  center: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 2,
    borderColor: "grey",
    borderRadius: 10,
    padding: 20,
    paddingBottom: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    width: "75%",
  },
  Header: {
    fontSize: 50,
    marginBottom: 40,
    marginTop: "40%",
  },
  SHeader: {
    fontSize: 18,
    color: "grey",
    marginRight: "55%",
  },
});

export default Singin;
