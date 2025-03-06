import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "QR Code Scanner",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await Linking.openURL(data);
            }, 300);
          }
        }}
      />

      <View style={styles.overlayContainer}>
        <BlurView intensity={100} style={[styles.blurArea, styles.topBlur]} />
        <BlurView
          intensity={100}
          style={[styles.blurArea, styles.bottomBlur]}
        />
        <BlurView intensity={100} style={[styles.blurArea, styles.leftBlur]} />
        <BlurView intensity={100} style={[styles.blurArea, styles.rightBlur]} />
      </View>
      <View style={styles.scanAreaIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  blurArea: {
    position: "absolute",
  },
  topBlur: {
    top: 0,
    left: 0,
    right: 0,
    height: (Dimensions.get("window").height - 250) / 2,
  },
  bottomBlur: {
    bottom: 0,
    left: 0,
    right: 0,
    height: (Dimensions.get("window").height - 250) / 2,
  },
  leftBlur: {
    top: (Dimensions.get("window").height - 250) / 2,
    left: 0,
    bottom: (Dimensions.get("window").height - 250) / 2,
    width: (Dimensions.get("window").width - 250) / 2,
  },
  rightBlur: {
    top: (Dimensions.get("window").height - 250) / 2,
    right: 0,
    bottom: (Dimensions.get("window").height - 250) / 2,
    width: (Dimensions.get("window").width - 250) / 2,
  },
  scanAreaIndicator: {
    position: "absolute",
    top: (Dimensions.get("window").height - 250) / 2,
    left: (Dimensions.get("window").width - 250) / 2,
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    backgroundColor: "transparent",
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
    borderEndEndRadius: 0,
    borderBottomLeftRadius: 0,
    zIndex: 10,
  },
});
