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

import ImageTypes from "../components/ImageTypes";

export default class DropInModal extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animated.View style={[this.props.style,
            { transform: [{ translateX: this.props.location.x }, { translateY: this.props.location.y }] }
          ]} >
        <Text style = {styles.text} >Find all the eights!</Text>
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
  text: {
    flexDirection: 'column',
    height: TILE_WIDTH/2.5,
    fontSize: TILE_WIDTH / 3,
    textAlign: "center",
  }
});

module.exports = DropInModal;
