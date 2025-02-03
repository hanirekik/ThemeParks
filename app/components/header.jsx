import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const Header = () => (
  <Animated.View style={styles.header} entering={FadeIn.duration(800)}>
    <Text style={styles.title}>Welcome to Disneyland Paris!</Text>
    <Text style={styles.subTitle}>Your magical journey starts here ✨</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4B0082",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: "#dcdcdc",
    textAlign: "center",
  },
});

export default Header;
