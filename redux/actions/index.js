import firebase from "firebase";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants/index";
require("firebase/firestore");

export function ClearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("user")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("user does not exist");
        }
      });
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const uid = snapshot.docs[0].ref.path.split("/")[1];
        } else {
          const uid = null;
        }

        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts: posts, uid: uid });
      });
  };
}
export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("Following")
      .doc(firebase.auth().currentUser.uid)
      .collection("UserFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i]));
        }
      });
  };
}

export function fetchUsersData(uid) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      firebase
        .firestore()
        .collection("user")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;

            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            dispatch(fetchUsersFollowingPosts(user.uid));
          } else {
            console.log("does not exist");
          }
        });
    }
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
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
          dispatch({ type: USER_POSTS_STATE_CHANGE, posts: posts });
        } else {
          console.log("User has not posted anything");
        }
      });
  };
}
