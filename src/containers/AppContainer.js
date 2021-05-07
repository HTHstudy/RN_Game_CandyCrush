import React, {Component} from 'react';
import ReactNative, {Dimensions} from 'react-native';
// import Dimensions from "Dimensions";
import ImageTypes from '../components/ImageTypes';

const HomeScreen = require('../screens/HomeScreen');
const MatchingGameScreen = require('../screens/MatchingGameScreen');
const SpeedGameScreen = require('../screens/SpeedGameScreen');
const HighScores = require('../screens/HighScores');
const ChunksGameScreen = require('../screens/ChunksGameScreen');
const SwappingGameScreen = require('../screens/SwappingGameScreen');
const {View, Text, TouchableHighlight, Button, StyleSheet, Image, ImageBackground} = ReactNative;

import {createBottomTabNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

let floatingClouds = require('../assets/FloatingClouds.png');
let justClouds = require('../assets/CloudsBackground.png');

const ChunksGame = ({navigation, screenProps}) => {
  return <ChunksGameScreen navigation={navigation} screenProps={screenProps} />;
};

const MatchingGame = ({navigation, screenProps}) => {
  return <MatchingGameScreen navigation={navigation} screenProps={screenProps} />;
};

const SwappingGame = ({navigation, screenProps}) => {
  return <SwappingGameScreen navigation={navigation} screenProps={screenProps} />;
};

const SpeedGame = ({navigation, screenProps}) => {
  return <SpeedGameScreen navigation={navigation} screenProps={screenProps} />;
};

const Home = ({navigation, screenProps}) => {
  return <HomeScreen navigation={navigation} screenProps={screenProps} />;
};

const High = ({navigation, screenProps}) => {
  return <HighScores navigation={navigation} screenProps={screenProps} />;
};

const PlayerTabs = createBottomTabNavigator({
  MainTab: {
    screen: MatchingGame,
    navigationOptions: {
      title: 'Welcome',
      tabBarLabel: 'Home',
      tabBarIcon: () => <Image style={styles.tabBarIcon} source={ImageTypes.BLUEJELLYBEAN} />,
    },
  },
});

const AppNavigator = createStackNavigator({
  Root: {
    screen: Home,
    navigationOptions: {
      title: 'title',
      header: null,
      gesturesEnabled: false,
    },
    // screen: MatchingGame,
    // navigationOptions: {
    //   title: 'Play!',
    //   header: null,
    //   gesturesEnabled: false,
    // },
  },
  GameScreen: {
    screen: MatchingGame,
    navigationOptions: {
      title: 'Play!',
      header: null,
      gesturesEnabled: false,
    },
  },
  SwappingGame: {
    screen: SwappingGame,
    navigationOptions: {
      title: 'Play!',
      header: null,
      gesturesEnabled: false,
    },
  },
  ChunksScreen: {
    screen: ChunksGame,
    navigationOptions: {
      title: 'Play!',
      header: null,
      gesturesEnabled: false,
    },
  },
  SpeedGame: {
    screen: SpeedGame,
    navigationOptions: {
      title: 'Play!',
      header: null,
      gesturesEnabled: false,
    },
  },
  HighScores: {
    screen: High,
    navigationOptions: {
      title: 'Play!',
      header: null,
      gesturesEnabled: false,
    },
  },
});

let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 200,
    justifyContent: 'center',
    backgroundColor: '#2c3e50',
  },
  backGroundImage: {
    width: '100%',
    height: '100%',
    //alignSelf: 'stretch'
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropZone: {
    flex: 1,
    height: 100,
    backgroundColor: '#2c3e50',
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff',
  },

  container: {
    height: 350,
    width: 350,
    backgroundColor: '#f21859',
  },
  tabBarIcon: {
    width: 35,
    height: 35,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: '#f21859',
    borderWidth: 5,
    borderColor: '#ffffff',
  },
});

module.exports = createAppContainer(AppNavigator);
