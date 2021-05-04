import React from 'react';
// import {View, Text, TouchableHighlight, Button, StyleSheet, Image, ImageBackground, Animated, Dimensions} from 'react-native';
import {StyleSheet, ImageBackground, Dimensions} from 'react-native';
import SwappableGrid from '../components/SwappableGrid';

import Images from '../lib/Images';

let playButton = require('../assets/PlayButton.png');

let justClouds = require('../assets/CloudsBackground.png');

const GameScreen = ({navigation}) => {
  return (
    <ImageBackground source={justClouds} style={styles.backGroundImage}>
      <SwappableGrid />
    </ImageBackground>
  );
};

let Window = Dimensions.get('window');
let windowSpan = Math.min(Window.width, Window.height);
let colored = true;
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let blue = colored ? '#3c44d8' : '#ffffff';
let red = colored ? '#f24646' : '#ffffff';
let yellow = colored ? '#faff7f' : '#ffffff';
let green = colored ? '#168e3a' : '#ffffff';
let orange = colored ? '#ea0e62' : '#ffffff';
let pink = colored ? '#ff51f3' : '#ffffff';
let white = '#ffffff';

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GameScreen;
