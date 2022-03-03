import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/MaterialIcons";

export default function App({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
    if (image !== null) {
      navigation.navigate("Post", { image });
    }
  }, [image]);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to the camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>
      <View style={styles.CameraControls}>
        <Icon1
          style={{ paddingHorizontal: 5 }}
          color="black"
          name="flip-camera-android"
          size={50}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
        <Icon
          style={{ paddingHorizontal: 5 }}
          color="black"
          name="camera-iris"
          size={100}
          onPress={() => takePicture()}
        />
        <Icon
          style={{ paddingHorizontal: 5 }}
          color="black"
          name="image"
          size={50}
          onPress={() => pickImage()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  CameraControls: {
    flexDirection: "row",
    padding: 40,
    justifyContent: "space-around",
  },
});
