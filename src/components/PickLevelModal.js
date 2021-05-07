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
  ImageBackground,
  TouchableOpacity
} from "react-native";

import ImageTypes from "../components/ImageTypes";

let LevelOneButton = require("../assets/LevelOneButton.png");
let LevelTwoButton = require("../assets/LevelTwoButton.png");
let LevelThreeButton = require("../assets/LevelThreeButton.png");
let LevelFourButton = require("../assets/LevelFourButton.png");

export default class PickLevelsModal extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Animated.View
        style={[
          this.props.style,
          {
            transform: [
              { translateX: this.props.location.x },
              { translateY: this.props.location.y }
            ]
          }
        ]}
      >
        <View style={styles.headerText}>
          <Text style={styles.text}> Pick a Level! </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => this.props.selectLevel(1)}
            >
              <Image style={styles.buttonImage} source={LevelOneButton} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => this.props.selectLevel(2)}
            >
              <Image style={styles.buttonImage} source={LevelTwoButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => this.props.selectLevel(3)}
            >
              <Image style={styles.buttonImage} source={LevelThreeButton} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.levelButton}
              onPress={() => this.props.selectLevel(4)}
            >
              <Image style={styles.buttonImage} source={LevelFourButton} />
            </TouchableOpacity>
          </View>
        </View>
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
  levelButton: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column"
  },
  headerText: {
    height: TILE_WIDTH / 2,
    width: 5 * TILE_WIDTH,
    flexDirection: "row",
    borderRadius: 10
  },
  buttonRow: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row"
  },
  buttonImage: {
    width: "100%",
    height: "100%"
  },
  text: {
    fontSize: TILE_WIDTH / 2.5,
    width: "100%",
    color: "gray",
    textAlign: "center"
  }
});

module.exports = PickLevelsModal;
