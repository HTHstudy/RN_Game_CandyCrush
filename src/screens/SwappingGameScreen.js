import React, { Component } from "react";
import ReactNative, {Dimensions} from 'react-native';
import SwappableGrid from "../components/SwappingGrid";
// import Dimensions from "Dimensions";

import TurnIndicator from "../components/TurnIndicator";
import { ImageTypes, VISUAL_ARRAYS_PROPS } from "../components/ImageTypes";
// Really should call this messege modal or something
// Modal management.
import DropInModal from "../components/DropInModal";
import PickLevelModal from "../components/PickLevelModal";

import { getJamJarFromBean } from "../components/JamFunctions";
import { connect } from "react-redux";

let playButton = require("../assets/PlayButton.png");

const {
  View,
  Text,
  TouchableHighlight,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  TouchableOpacity
} = ReactNative;

const InstructionalScenes = [
  ImageTypes.SWAPINSTRUCTIONS,
  ImageTypes.BEANINSTRUCTIONS,
  ImageTypes.JARINSTRUCTIONS,
  ImageTypes.RAINBOWINSTRUCTIONS
];

let floatingClouds = require("../assets/FloatingClouds.png");
let justClouds = require("../assets/CloudsBackground.png");
let tuffysCartoonHead = require("../assets/TuffyTile.png");
let EndGameScene = require("../assets/FloatingClouds.png");

class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.instructionsCompleted = true;
    this.tuffysHeadHeight = 50;
    // NOTE: This ensures that the swipe gestures are registerd in the correct location.
    // Be careful when modifying.
    this.topMargin = 2 * TILE_WIDTH + windowHeight / 2 - 4 * TILE_WIDTH;

    this.gameOver = false;

    this.state = {
      tuffysHeadScale: new Animated.Value(1),
      gameModalScale: new Animated.Value(1),
      modalIndex: 0,
      restart: false,
      currentLevel: null,
      tuffysHeadLocation: new Animated.ValueXY(0, 0),
      gameModalLocation: new Animated.ValueXY(0, 0),
      numberOfMoves: 25,
      jamScore: 0,
      totalScore: null,
      beanScore: 0,
      scoreOpacity: new Animated.Value(1),
      turnScale: new Animated.Value(1),
      instructionsIndex: 0,
      xyDropInModal: new Animated.ValueXY(0, 0),
      xyPickLevelModal: new Animated.ValueXY(0, 0)
    };
  }

  animateTuffysHead() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight,
        friction: 10,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }

  endGame() {
    this.gameOver = true;
    this.dropModal();
  }

  dropPickLevelModal() {
    Animated.spring(this.state.xyPickLevelModal, {
      toValue: { x: 0, y: 0.2 * windowHeight },
      friction: 3,
      useNativeDriver: true
    }).start();
  }

  showTuffy() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }

  moveModalTo(yLocation) {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.gameModalLocation.y, {
        toValue: yLocation,
        friction: 5,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.delay(100),
      Animated.spring(this.state.gameModalLocation.x, {
        toValue: 0,
        friction: 5,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }

  restartGame() {
    const { navigate } = this.props.navigation;
    navigate("Root");
  }

  dropModal() {
    this.moveModalTo(0);
  }

  hideModal() {
    this.moveModalTo(-7 * TILE_WIDTH);
  }

  dropMessageModal(messege) {
    Animated.spring(this.state.xyDropInModal, {
      toValue: { x: 0, y: 50 },
      friction: 3,
      useNativeDriver: true
    }).start();
  }

  incrementTurns(inc) {
    let scale = 1;
    let { numberOfMoves } = this.state;
    numberOfMoves = numberOfMoves + inc;
    this.setState({ numberOfMoves: numberOfMoves });
    if (this.state.numberOfMoves == 0) {
      this.gameOver = true;
      this.endGame();
    }
    if (inc < 0) {
      scale = 0.8;
    } else if (inc > 0) {
      scale = 1.5;
    }

    Animated.sequence([
      Animated.timing(this.state.turnScale, {
        toValue: scale,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(this.state.turnScale, {
        toValue: 1.0,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
  }

  updateScore(beans, jam) {
    Animated.timing(this.state.scoreOpacity, {
      toValue: 1,
      duration: 1000
    }).start();

    let { beanScore } = this.state;
    let { jamScore } = this.state;

    jamScore = jamScore;
    beanScore = beanScore + beans;
    totalScore = jamScore + beanScore;

    this.setState({ beanScore: beanScore });
    this.setState({ jamScore: jamScore });
    this.setState({ totalScore: totalScore });

    console.log("tiles left", jam);
    if (jam == 0) {
      this.endGame();
    }
  }

  componentWillMount() {
    this.state.tuffysHeadLocation.setValue({
      x: 0,
      y: windowHeight
    });
    this.state.gameModalLocation.setValue({
      x: 0,
      y: -7 * TILE_WIDTH
    });

    this.dropPickLevelModal();
  }

  selectLevel(level) {
    this.setState({ totalScore: 0 });
    Animated.timing(this.state.xyPickLevelModal, {
      toValue: { x: 1.2 * windowWidth, y: 0.2 * windowHeight },
      duration: 300,
      useNativeDriver: true
    }).start();
    this.setState({ currentLevel: level });
  }

  justPlayGame() {
    this.instructionsCompleted = true;
    this.hideModal();
  }

  gameModalContent(i) {
    const { navigate } = this.props.navigation;

    if (i == InstructionalScenes.length) {
      this.instructionsCompleted = true;
      this.hideModal();
    }

    if (this.instructionsCompleted == false) {
      return (
        <View style={styles.gameModalContainer}>
          <Image
            style={styles.gameModalImage}
            source={InstructionalScenes[i]} //NOTE: Array and indexes go here
          />
          <View style={styles.modalButtonsRow}>
            <TouchableHighlight
              underlayColor={"white"}
              onPress={this.justPlayGame.bind(this)}
              style={styles.justPlayButton}
            >
              <Text style={styles.justPlayButtonText}> Just Play!</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={"white"}
              style={styles.nextButton}
              onPress={this.nextInstructions.bind(this)}
            >
              <Text style={styles.modalButtonText}>Next Hint</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.gameModalContainer}>
          <ImageBackground style={styles.gameModalImage} source={EndGameScene}>
            <Text style={styles.finalScoreText}>
              {" "}
              {this.state.totalScore} Points!{" "}
            </Text>
          </ImageBackground>
          <View style={styles.modalButtonsRow}>
            <TouchableHighlight
              underlayColor={"white"}
              style={styles.playAgainButton}
              onPress={() => navigate("Root")}
            >
              <Text style={styles.playAgainButtonText}>Play Again!</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }

  nextInstructions() {
    if (this.state.modalIndex == InstructionalScenes.length - 1) {
      this.instructionsCompleted = true;
      this.hideModal();
    } else {
      Animated.sequence([
        Animated.timing(this.state.gameModalScale, {
          toValue: 1.1,
          duration: 150,
          decay: 1,
          useNativeDriver: true
        }),
        Animated.timing(this.state.gameModalScale, {
          toValue: 1,
          duration: 150,
          decay: 4,
          useNativeDriver: true
        })
      ]).start();

      this.setState({ modalIndex: this.state.modalIndex + 1 });
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    let [translateX, translateY] = [
      this.state.tuffysHeadLocation.x,
      this.state.tuffysHeadLocation.y
    ];

    let scale = this.state.tuffysHeadScale;

    let backButton = (
      <TouchableOpacity
        underlayColor={"white"}
        style={styles.backButton}
        onPress={() => navigate("Root")}
      >
        <Image style={styles.backButtonImage} source={ImageTypes.BACKARROW} />
      </TouchableOpacity>
    );

    let topOfTuffyComponent = (
      <Animated.View
        style={[
          styles.tuffysHeadContainer,
          { transform: [{ translateX }, { translateY }, { scale }] }
        ]}
      >
        <Image style={styles.tuffysHead} source={ImageTypes.TOPOFTUFFYSHEAD} />
      </Animated.View>
    );

    [translateX, translateY] = [
      this.state.gameModalLocation.x,
      this.state.gameModalLocation.y
    ];

    scale = this.state.gameModalScale;

    let gameModal = (
      <Animated.View
        style={[
          styles.gameOverModal,
          { transform: [{ translateX }, { translateY }, { scale }] }
        ]}
      >
        {this.gameModalContent(this.state.modalIndex)}
      </Animated.View>
    );

    // TODO: D.R.Y.
    const descriptor = gameOver => {
      let opacity = this.state.scoreOpacity;
      if (!gameOver) {
        return (
          <View style={styles.topBar}>
            {backButton}
            <Animated.View style={[styles.text, { opacity }]}>
              <Text style={styles.text}>{this.state.totalScore}</Text>
            </Animated.View>
            {this.state.currentLevel != null && (
              <TurnIndicator
                scale={this.state.turnScale}
                text={this.state.numberOfMoves}
              />
            )}
          </View>
        );
      } else {
        return (
          <View style={styles.topBar}>
            {backButton}
            <Text style={styles.text} />
            <TurnIndicator scale={this.state.turnScale} text={""} />
          </View>
        );
      }
    };

    return (
      <ImageBackground source={justClouds} style={styles.backGroundImage}>
        {descriptor(this.gameOver)}
        <View style={styles.gridContainer}>
          <SwappableGrid
            gameOver={this.gameOver}
            topMargin={this.topMargin}
            currentLevel={this.state.currentLevel}
            animateTuffysHead={this.animateTuffysHead.bind(this)}
            updateScore={this.updateScore.bind(this)}
            incrementTurns={this.incrementTurns.bind(this)}
            {...this.props}
          />
        </View>
        <PickLevelModal
          selectLevel={this.selectLevel.bind(this)}
          location={this.state.xyPickLevelModal}
          style={styles.pickLevelModal}
        />
        {gameModal}
      </ImageBackground>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let colored = true;
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let blue = colored ? "#3c44d8" : "#ffffff";
let red = colored ? "#f24646" : "#ffffff";
let yellow = colored ? "#faff7f" : "#ffffff";
let green = colored ? "#168e3a" : "#ffffff";
let orange = colored ? "#ea0e62" : "#ffffff";
let pink = colored ? "#ff51f3" : "#ffffff";
let white = "#ffffff";

let styles = StyleSheet.create({
  gameModalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: 6 * TILE_WIDTH,
    height: 6 * TILE_WIDTH
    //backgroundColor: orange
  },
  gameModalImage: {
    width: 6 * TILE_WIDTH,
    height: 6 * TILE_WIDTH,
    borderRadius: TILE_WIDTH / 2
  },
  modalButtonsRow: {
    flexDirection: "row",
    flex: 1
  },
  backButton: {
    flex: 1,
    height: TILE_WIDTH,
    justifyContent: "center"
  },
  backButtonImage: {
    height: 0.5 * TILE_WIDTH,
    width: 0.5 * TILE_WIDTH
  },
  turnIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#168e3a"
  },
  backGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: "column",
    alignItems: "center"
  },
  modalbackGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: TILE_WIDTH / 3
  },
  imageWithContent: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  topBarAndGridContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  bottomBar: {
    alignItems: "center"
    //backgroundColor: "grey"
  },
  gridContainer: {
    height: 5 * TILE_WIDTH,
    width: 5 * TILE_WIDTH,
    alignItems: "center",
    marginTop: windowHeight / 2 - 4 * TILE_WIDTH
    //backgroundColor: blue
  },
  topBar: {
    marginTop: TILE_WIDTH / 2,
    //marginTop: 1/2*(1/2*windowHeight - TILE_WIDTH*5/2)-TILE_WIDTH/2,
    height: TILE_WIDTH * 1.1,
    width: 5.5 * TILE_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: TILE_WIDTH / 2
  },
  text: {
    flex: 5,
    //backgroundColor: "#ff51f3",
    textAlign: "center",
    fontFamily: "ChalkboardSE-Regular",
    fontSize: TILE_WIDTH / 1.5
    //alignItems: "center"
    //backgroundColor: "blue"
    //color       : '#fff'
  },
  finalScoreText: {
    flex: 1,
    marginTop: 2 * TILE_WIDTH,
    textAlign: "center",
    fontFamily: "ChalkboardSE-Regular",
    fontSize: TILE_WIDTH / 1.5,
    alignItems: "center"
  },
  leaveGameButton: {
    width: TILE_WIDTH,
    height: TILE_WIDTH / 2
  },
  scoreText: {
    alignItems: "center",
    textAlign: "center",
    fontFamily: "ChalkboardSE-Regular",
    fontSize: TILE_WIDTH / 1.5
  },
  gameOverModal: {
    position: "absolute",
    height: 7 * TILE_WIDTH,
    width: 6 * TILE_WIDTH,
    flexDirection: "column"
  },
  finalScoreModal: {
    height: 2 * TILE_WIDTH,
    backgroundColor: white,
    borderRadius: TILE_WIDTH / 5
  },
  tuffysHeadContainer: {
    position: "absolute",
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH
    //backgroundColor: "#c00ffe"
  },
  turnIndicator: {
    flex: 1,
    alignItems: "center"
  },
  tuffysHead: {
    position: "absolute",
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH
    //backgroundColor: "#c00ffe"
  },
  nextButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TILE_WIDTH / 1.5,
    backgroundColor: "#B045FF",
    borderRadius: TILE_WIDTH / 5
  },
  playAgainButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TILE_WIDTH / 1.5,
    backgroundColor: "white",
    borderRadius: TILE_WIDTH / 5,
    borderWidth: TILE_WIDTH / 80
  },
  justPlayButtonText: {
    fontSize: TILE_WIDTH / 3,
    fontFamily: "ChalkboardSE-Regular",
    color: "#9135EE"
  },
  modalButtonText: {
    fontSize: TILE_WIDTH / 3,
    color: "#FFF65F",
    fontFamily: "ChalkboardSE-Regular"
  },
  playAgainButtonText: {
    fontSize: TILE_WIDTH / 3,
    fontFamily: "ChalkboardSE-Regular"
  },
  dropInModal: {
    position: "absolute",
    width: TILE_WIDTH * 5.5,
    height: TILE_WIDTH * 1.25,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: white,
    borderColor: "gray",
    borderWidth: 5
  },
  justPlayButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TILE_WIDTH / 1.5,
    backgroundColor: "#FFF65F",
    borderRadius: TILE_WIDTH / 5
  },
  pickLevelModal: {
    position: "absolute",
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5.5,
    justifyContent: "center"
  }
});

function mapStateToProps(state) {
  return {
    level: state.levelReducer
  };
}

module.exports = connect(mapStateToProps)(GameScreen);
