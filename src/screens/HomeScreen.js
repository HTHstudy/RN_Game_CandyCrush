import React, { Component } from "react";
import ReactNative, {Dimensions} from 'react-native';
//import {App} from './App';
// import Dimensions from "Dimensions";
import { connect } from "react-redux";


const {
  View,
  Text,
  TouchableHighlight,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity
} = ReactNative;

let playButton = require("../assets/PlayButton.png");
let LevelOneButton = require("../assets/LevelOneButton.png");
let LevelTwoButton = require("../assets/LevelTwoButton.png");
let LevelThreeButton = require("../assets/LevelThreeButton.png");
let LevelFourButton = require("../assets/LevelFourButton.png");
let PracticeButton = require("../assets/PracticeButton.png");
let MatchingButton = require("../assets/MatchingButton.png");
let ChunkingButton = require("../assets/ChunkingButton.png");
let SwappingButton = require("../assets/SwappingButton.png");
let GoButton = require("../assets/GoButton.png")


let floatingClouds = require("../assets/FloatingClouds.png");
let justClouds = require("../assets/CloudsBackground.png");
let tuffyMainLogo = require("../assets/JellyBeanJamLogo.png");
let tuffyCartoonHead = require("../assets/TuffysHead.png");
let tuffyShrugging = require("../assets/TuffyShrugging.png");

class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  setLevel(value) {
    const { navigate } = this.props.navigation;
    console.log("props",this.props.dispatch({type: "SET_LEVEL"}))
    console.log('this.props.level',this.props.level)
    //navigate("GameScreen")
  }

  // FOR TESTING REDUX: <Text> The Red Bean Count Is: {this.props.screenProps.redBeanCount} </Text>
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground source={justClouds} style={styles.backGroundImage}>
        <TouchableOpacity
            style={styles.gobutton}
            // onPress={() =>navigate("ChunksScreen")}
            onPress={() =>navigate("SwappingGame")}
          >
            <Image source={GoButton} style={styles.backGroundImage} />
          </TouchableOpacity>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    level: state.levelReducer,
  };
}


let Window = Dimensions.get("window");
let windowWidth = Window.width;
let windowHeight = Window.height;

let styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    alignItems: "center",
    //backgroundColor: 'blue'
  },
  header: {
    marginTop: windowWidth/5,
    width: 0.8 * windowWidth,
    height: 0.8 * windowWidth * 0.33
    //backgroundColor:'#2c3e50'
  },
  footer: {
    position: 'absolute',
    width: 0.7 * windowWidth,
    height: 0.7 * windowWidth * 0.76,
    top: windowHeight - 0.7 * windowWidth * 0.76
  },
  backGroundImage: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "column",
    width: undefined,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center'
    //backgroundColor: 'red',
  },
  playbutton: {
    marginTop: 50,
    height: windowWidth / 6,
    width: windowWidth / 1.5,
    alignItems: "center"
    //backgroundColor:'#2c3e50'
  },
  gobutton: {
    height: windowWidth / 3,
    width: windowWidth / 3,
    alignItems: "center"
    //backgroundColor:'#2c3e50'
  }
});

module.exports = connect(mapStateToProps)(HomeScreen);
