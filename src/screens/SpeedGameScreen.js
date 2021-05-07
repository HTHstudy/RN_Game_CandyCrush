import React, { Component } from "react";
import ReactNative, {Dimensions} from 'react-native';
import SafariGrid from "../components/SafariGrid";
// import Dimensions from "Dimensions";

import TurnIndicator from "../components/TurnIndicator";
import {
  ImageTypes,
  shuffleNumbersWithType,
  initOrangeNumbers,
  initPurpleNumbers,
  initPinkNumbers,
  initGreenNumbers,
  initBlueNumbers,
  initRedNumbers
} from "../components/ImageTypes";

import DropInModal from "../components/DropInModal";
import PickLevelModal from "../components/PickLevelModal";

import { getJamJarFromBean } from "../components/JamFunctions";
import { connect } from "react-redux";

import { Types, getNumbersWithType } from "../components/ImageTypes";

let playButton = require("../assets/PlayButton.png");
let NumberLine = require("../assets/NumberLine.png");

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

const num_zero = require("../assets/num-zero.png");
const num_one = require("../assets/num-one.png");
const num_two = require("../assets/num-two.png");
const num_three = require("../assets/num-three.png");
const num_four = require("../assets/num-four.png");
const num_five = require("../assets/num-five.png");
const num_six = require("../assets/num-six.png");
const num_seven = require("../assets/num-seven.png");
const num_eight = require("../assets/num-eight.png");
const num_nine = require("../assets/num-nine.png");
const num_ten = require("../assets/num-ten.png");

const Numbers = [
  num_one,
  num_two,
  num_three,
  num_four,
  num_five,
  num_six,
  num_seven,
  num_eight,
  num_nine,
  num_ten
];

class SpeedGameScreen extends Component {
  constructor(props) {
    super(props);

    this.instructionsCompleted = true;
    this.tuffysHeadHeight = 50;

    // NOTE: This ensures that the swipe gestures are registerd in the correct location.
    // Be careful when modifying.
    this.topMargin = 2 * TILE_WIDTH + windowHeight / 2 - 3.5 * TILE_WIDTH;

    this.gameOver = false;

    this.myLevels = [
      Types.BLUE,
      Types.RED,
      Types.PURPLE,
      Types.ORANGE,
      Types.PINK,
      Types.GREEN
    ];
    this.cardsForThisLevel = shuffleNumbersWithType(this.myLevels[0]);
    this.cardCue = [
      ...this.cardsForThisLevel,
      ...this.cardsForThisLevel,
      ...this.cardsForThisLevel
    ];

    this.levelComplete = false;

    this.currentLevelIndex = 0;
    this.state = {
      prompt: "Find all the 1's",
      timer: null,
      timeCount: 0,
      xyLevelModal: new Animated.ValueXY(0, 0),
      tuffysHeadScale: new Animated.Value(1),
      gameModalScale: new Animated.Value(1),
      modalIndex: 0,
      numbersFound: [],
      toastLocation: new Animated.ValueXY(0, 0),
      gameModalLocation: new Animated.ValueXY(0, 0),
      numberOfMoves: 10,
      totalScore: 0,
      beanScore: 0,
      turnScale: new Animated.Value(1),
      instructionsIndex: 0,
      xyDropInModal: new Animated.ValueXY(0, 0),
      numbersData: this.initNumbersData(-300, 0),
      currentLevel: null,
      currentLevelImages: getNumbersWithType(Types.BLUE)
    };
  }

  initNumbersData(a, b) {
    let n = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return n.map(e => new Animated.ValueXY({ x: a, y: b }));
  }

  animateTuffysHead() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.toastLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(this.state.toastLocation.y, {
        toValue: windowHeight,
        friction: 10,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }

  endGame() {
    this.dropModal();
  }

  popToast() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.toastLocation.y, {
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

  nextPrompt(val) {
    console.log("val,level", val, this.state.currentLevel);
    if (val > 4 + this.state.currentLevel) {
      this.gameOver = true;
      this.dropModal();
    } else {
      val += 1;
      this.setState({ prompt: "Find all the " + val + "'s" });
    }
  }

  updateScore(messege) {
    this.setState({ prompt: "balls" });

    /*
    const { value, isValid, turnOver, gameOver } = gameState;

    if (!isValid) {
      this.incrementTurns(-1);
      this.setState({ totalScore: this.state.totalScore - value });
    } else {
      this.setState({ totalScore: this.state.totalScore + value });
      //this.setState({totalScore: 10})
      Animated.timing(this.state.numbersData[value - 1], {
        toValue: { x: (TILE_WIDTH / 2) * (value - 1), y: 0 },
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        if (turnOver) {
          this.state.numbersData.forEach(e => {
            Animated.timing(e, {
              toValue: { x: -300, y: 0 },
              duration: 300,
              useNativeDriver: true
            }).start();
          });
          if (gameOver) {
            this.endGame();
          } else {
            this.currentLevelIndex += 1;
            setTimeout(
              () =>
                this.setState({
                  currentLevelImages: getNumbersWithType(
                    this.myLevels[this.currentLevelIndex]
                  )
                }),
              300
            );
          }
        }
      });
    }
    */
  }

  renderNumberLine(data) {
    return (
      <ImageBackground source={NumberLine} style={styles.numberLineBackGround}>
        {this.renderNumbers(data)}
      </ImageBackground>
    );
  }

  renderNumbers(data) {
    return data.map((e, i) => (
      <Animated.Image
        key={i}
        source={this.state.currentLevelImages[i].img}
        style={[
          styles.normalTile,
          { transform: [{ translateX: e.x }, { translateY: e.y }] }
        ]}
      />
    ));
  }

  incrementTimer = () => {
    if (!this.gameOver) {
      //this.setState({ timeCount: this.state.timeCount + 1 });
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  componentWillMount() {
    let timer = setInterval(this.incrementTimer, 1000);
    this.setState({ timer });

    this.dropPickLevelModal();

    this.state.toastLocation.setValue({
      x: 0,
      y: windowHeight
    });
    this.state.gameModalLocation.setValue({
      x: 0,
      y: -7 * TILE_WIDTH
    });
  }

  goToNextLevel() {
    this.hideModal();
  }

  goBack() {
    this.setState({ numbersData: this.initNumbersData(0, 0) });
    const { navigate } = this.props.navigation;
    navigate("Root");
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
              {this.state.timeCount} seconds!
            </Text>
          </ImageBackground>
          <View style={styles.modalButtonsRow}>
            <TouchableHighlight
              underlayColor={"white"}
              style={styles.playAgainButton}
              onPress={() => this.goBack()}
            >
              <Text style={styles.playAgainButtonText}>Next Level</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }

  componentWillUnmount() {
    console.log("COMPONENT IS UNMOUNTING!!");
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
  selectLevel(level) {
    this.setState({ totalScore: 0 });
    Animated.timing(this.state.xyLevelModal, {
      toValue: { x: 1.2 * windowWidth, y: 0.2 * windowHeight },
      duration: 300,
      useNativeDriver: true
    }).start();
    this.setState({ currentLevel: level });
  }

  dropPickLevelModal() {
    Animated.spring(this.state.xyLevelModal, {
      toValue: { x: 0, y: 0.2 * windowHeight },
      friction: 3,
      useNativeDriver: true
    }).start();
  }

  render() {
    let backButton = (
      <TouchableOpacity
        underlayColor={"white"}
        style={styles.backButton}
        onPress={() => this.goBack()}
      >
        <Image style={styles.backButtonImage} source={ImageTypes.BACKARROW} />
      </TouchableOpacity>
    );

    let gameModal = (
      <Animated.View
        style={[
          styles.gameOverModal,
          {
            transform: [
              { translateX: this.state.gameModalLocation.x },
              { translateY: this.state.gameModalLocation.y },
              { scale: this.state.gameModalScale }
            ]
          }
        ]}
      >
        {this.gameModalContent(this.state.modalIndex)}
      </Animated.View>
    );

    // TODO: D.R.Y.
    const descriptor = gameOver => {
      if (!gameOver) {
        return (
          <View style={styles.topBar}>
            {backButton}
            <Text style={styles.text}>{this.state.prompt}</Text>
            <TurnIndicator
              scale={this.state.turnScale}
              text={this.state.timeCount}
            />
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
          <SafariGrid
            gameOver={this.gameOver}
            topMargin={this.topMargin}
            currentLevel={this.state.currentLevel}
            nextPrompt={this.nextPrompt.bind(this)}
            incrementTurns={this.incrementTurns.bind(this)}
            {...this.props}
          />
        </View>
        <PickLevelModal
          selectLevel={this.selectLevel.bind(this)}
          location={this.state.xyLevelModal}
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
    justifyContent: "center"
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
  numberLine: {
    alignItems: "center",
    marginBottom: 0.25 * TILE_WIDTH,
    marginTop: 0.25 * TILE_WIDTH,
    width: 5 * TILE_WIDTH,
    height: 0.5 * TILE_WIDTH
  },
  gridContainer: {
    height: 5 * TILE_WIDTH,
    width: 5 * TILE_WIDTH,
    alignItems: "center",
    marginTop: windowHeight / 2 - 4 * TILE_WIDTH
  },
  topBar: {
    marginTop: TILE_WIDTH / 2,
    //marginTop: 1/2*(1/2*windowHeight - TILE_WIDTH*5/2)-TILE_WIDTH/2,
    height: TILE_WIDTH * 1.1,
    width: 5.5 * TILE_WIDTH,
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    flex: 5,
    //backgroundColor: "#ff51f3",
    textAlign: "center",
    fontFamily: "ChalkboardSE-Regular",
    fontSize: TILE_WIDTH / 3
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
    borderRadius: TILE_WIDTH / 5
  },
  normalTile: {
    width: TILE_WIDTH / 2,
    height: TILE_WIDTH / 2,
    position: "absolute"
  },
  numberFrame: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "blue",
    width: "100%"
  },
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "blue",
    width: "100%"
  },
  numberLineBackGround: {
    marginTop: 0.25 * TILE_WIDTH,
    marginBottom: 0.25 * TILE_WIDTH,
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 0.5
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

module.exports = connect(mapStateToProps)(SpeedGameScreen);
