import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
} from "react-native";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { useCameraPermissions } from "expo-camera";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 40 }}>
        {!isPermissionGranted && (
          <Pressable onPress={requestPermission}>
            <Text style={styles.buttonTextStyle}>Request Permissions</Text>
          </Pressable>
        )}
        <Link href={"/scanner"} asChild>
          <Pressable
            disabled={!isPermissionGranted}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View
              style={[
                styles.animatedButton,
                { transform: [{ scale: scaleValue }] },
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              <Text style={styles.buttonStyle}>Scan Code</Text>
            </Animated.View>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#141f00",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "#c5fc1f",
    fontSize: 40,
  },
  buttonTextStyle: {
    color: "#c5fc1f",
    fontSize: 24,
    textAlign: "center",
  },
  buttonStyle: {
    color: "#141f00",
    fontSize: 20,
    textAlign: "center",
  },
  animatedButton: {
    backgroundColor: "#c5fc1f",
    padding: 15,
    borderRadius: 50,
  },
});
