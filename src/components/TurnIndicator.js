/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  ImageBackground
} from "react-native";

import { ImageTypes } from "../components/ImageTypes";

export default class TurnIndicator extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animated.View
        style={[styles.animView, { transform: [{ scale: this.props.scale }] }]}
      >
        <Image style={styles.image} source={ImageTypes.TURNINDICATORIMAGE} />
        <Text style={styles.text}>{this.props.text}</Text>
      </Animated.View>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let styles = StyleSheet.create({
  animView: {
    flex: 1,
    width: TILE_WIDTH,
    height: TILE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: TILE_WIDTH / 4.5
  },
  text: {
    flex: 1,
    width: 0.8 * TILE_WIDTH,
    height: 0.8 * TILE_WIDTH,
    fontSize: TILE_WIDTH / 3,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "ChalkboardSE-Regular"
  },
  image: {
    width: 0.8 * TILE_WIDTH,
    height: 0.8 * TILE_WIDTH,
    position: "absolute"
  },
  gameSummary: {
    flexDirection: "column",
    backgroundColor: "#c00ffe"
  }
});

module.exports = TurnIndicator;
