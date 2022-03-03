import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import firebase from "firebase";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.Header}>Instagram</Text>
        <Text style={styles.SHeader}>E-mail</Text>
        <TextInput
          onChangeText={(email) => this.setState({ email })}
          style={styles.input}
        />
        <Text style={styles.SHeader}>Password</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          style={styles.input}
        />

        <View style={styles.center}>
          <TouchableOpacity onPress={() => this.onLogin}>
            <Text style={styles.button}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Signin")}
        >
          <Text style={{ fontSize: 17, marginTop: 10, color: "#0000FF" }}>
            Sign in insted?
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 120,
    paddingVertical: 10,
    backgroundColor: "#5DA3FA",
    width: "50%",
    textAlign: "center",
    marginTop: 20,
    paddingLeft: 55,
    marginLeft: 60,
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

export default Login;
