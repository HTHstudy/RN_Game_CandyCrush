/**
 * Sample React Native App
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
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";

let pjb = require("../assets/PinkJellyBean.png");
let pujb = require("../assets/PurpleJellyBean.png");
let bjb = require("../assets/BlueJellyBean.png");
let ojb = require("../assets/OrangeJellyBean.png");
let gjb = require("../assets/GreenJellyBean.png");
let yjb = require("../assets/YellowJellyBean.png");
let rjb = require("../assets/RedJellyBean.png");

export default class Tile extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: false
    };
  }

  onPress() {
    this.props.onTouch(this.props.indices);
  }

  render() {
    const tileStyle = this.props.selected
      ? styles.selectedTile
      : styles.normalTile;

    return (
      <Animated.View
        onStartShouldSetResponder={this.onPress.bind(this)}
        style={[
          styles.normalTile,
          {
            transform: [
              { translateX: this.props.location.x },
              { translateY: this.props.location.y },
              { scale: this.props.scale }
            ]
          }
        ]}
      >
        <Image style={tileStyle} source={this.props.img} />
      </Animated.View>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 7;
let colored = false;

let styles = StyleSheet.create({
  selectedTile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH,
    position: "absolute",
    borderRadius: 5,
    borderColor: "#ef1f5d",
    borderWidth: TILE_WIDTH / 20
  },
  normalTile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH,
    position: "absolute"
  }
});

module.exports = Tile;
