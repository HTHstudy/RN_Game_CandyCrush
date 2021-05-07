import React, {Component} from 'react';
import ReactNative, {Dimensions} from 'react-native';
import ChunksGrid from '../components/ChunksGrid';

import TurnIndicator from '../components/TurnIndicator';
import {ImageTypes, shuffleNumbersWithType, initOrangeNumbers, initPurpleNumbers, initPinkNumbers, initGreenNumbers, initBlueNumbers, initRedNumbers, NUMERALS} from '../components/ImageTypes';
import PickLevelModal from '../components/PickLevelModal';

import {getJamJarFromBean} from '../components/JamFunctions';
import {connect} from 'react-redux';

import {Types, getNumbersWithType} from '../components/ImageTypes';

let playButton = require('../assets/PlayButton.png');
let NumberLine = require('../assets/NumberLine.png');

const {View, Text, TouchableHighlight, Button, StyleSheet, Image, ImageBackground, Animated, TouchableOpacity} = ReactNative;

const InstructionalScenes = [ImageTypes.SWAPINSTRUCTIONS, ImageTypes.BEANINSTRUCTIONS, ImageTypes.JARINSTRUCTIONS, ImageTypes.RAINBOWINSTRUCTIONS];

let floatingClouds = require('../assets/FloatingClouds.png');
let justClouds = require('../assets/CloudsBackground.png');
let tuffysCartoonHead = require('../assets/TuffyTile.png');
let EndGameScene = require('../assets/FloatingClouds.png');

const num_zero = require('../assets/num-zero.png');
const num_one = require('../assets/num-one.png');
const num_two = require('../assets/num-two.png');
const num_three = require('../assets/num-three.png');
const num_four = require('../assets/num-four.png');
const num_five = require('../assets/num-five.png');
const num_six = require('../assets/num-six.png');
const num_seven = require('../assets/num-seven.png');
const num_eight = require('../assets/num-eight.png');
const num_nine = require('../assets/num-nine.png');
const num_ten = require('../assets/num-ten.png');

const Numbers = [num_one, num_two, num_three, num_four, num_five, num_six, num_seven, num_eight, num_nine, num_ten];

class ChunksGameScreen extends Component {
  constructor(props) {
    super(props);

    this.instructionsCompleted = true;
    this.tuffysHeadHeight = 50;

    // NOTE: This ensures that the swipe gestures are registerd in the correct location.
    // Be careful when modifying.
    this.topMargin = 2 * TILE_WIDTH + windowHeight / 2 - 4.5 * TILE_WIDTH;

    this.gameOver = false;

    this.currentTrophy = null;

    this.levelComplete = false;

    this.currentLevelIndex = 0;
    this.state = {
      tuffysHeadScale: new Animated.Value(1),
      gameModalScale: new Animated.Value(1),
      modalIndex: 0,
      restart: false,
      numbersFound: [],
      trophyLocation: new Animated.ValueXY(0, 0),
      trophyScale: new Animated.Value(1),
      tuffysHeadLocation: new Animated.ValueXY(0, 0),
      gameModalLocation: new Animated.ValueXY(0, 0),
      numberOfMoves: 10,
      jamScore: 0,
      totalScore: null,
      beanScore: 0,
      turnScale: new Animated.Value(1),
      instructionsIndex: 0,
      xyDropInModal: new Animated.ValueXY(0, 0),
      currentLevel: null,
      xyLevelModal: new Animated.ValueXY(0, 0),
      currentLevelImages: getNumbersWithType(Types.BLUE),
      scoreFromLastTurn: '',
    };
  }

  animateTuffysHead() {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight - 2 * TILE_WIDTH,
        friction: 5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.tuffysHeadLocation.y, {
        toValue: windowHeight,
        friction: 10,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }

  endGame() {
    this.moveModalTo(0);
  }

  moveModalTo(yLocation) {
    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.state.gameModalLocation.y, {
        toValue: yLocation,
        friction: 5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(100),
      Animated.spring(this.state.gameModalLocation.x, {
        toValue: 0,
        friction: 5,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }

  restartGame() {
    const {navigate} = this.props.navigation;
    navigate('Root');
  }

  hideModal() {
    this.moveModalTo(-7 * TILE_WIDTH);
  }

  dropSelectLevelModal() {
    Animated.spring(this.state.xyLevelModal, {
      toValue: {x: 0, y: 0.2 * windowHeight},
      friction: 3,
      useNativeDriver: true,
    }).start();
  }

  dropMessageModal(messege) {
    Animated.spring(this.state.xyDropInModal, {
      toValue: {x: 0, y: 50},
      friction: 3,
      useNativeDriver: true,
    }).start();
  }

  incrementTurns(inc) {
    let scale = 1;
    let {numberOfMoves} = this.state;
    numberOfMoves = numberOfMoves + inc;
    this.setState({numberOfMoves: numberOfMoves});
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
        useNativeDriver: true,
      }),
      Animated.timing(this.state.turnScale, {
        toValue: 1.0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }

  selectLevel(level) {
    this.setState({totalScore: 0});
    Animated.timing(this.state.xyLevelModal, {
      toValue: {x: 1.2 * windowWidth, y: 0.2 * windowHeight},
      duration: 300,
      useNativeDriver: true,
    }).start();
    this.setState({currentLevel: level});
  }

  calculateLevel(score) {}

  getTrophy(score) {
    console.log('score', score);
    console.log;
    if (score >= 0 && score < 500) {
      console.log('blue');
      return ImageTypes.LITTLE_BLUE_TROPHY;
    } else if (score >= 500 && score < 1000) {
      console.log('green');
      return ImageTypes.LITTLE_GREEN_TROPHY;
    } else if (score >= 1000 && score < 2000) {
      console.log('bronze');
      return ImageTypes.MED_BRONZE_TROPHY;
    } else if (score >= 2000 && score < 4000) {
      console.log('silver');
      return ImageTypes.BIG_SILVER_TROPHY;
    } else if (score > 4000 && score < 7000) {
      return ImageTypes.BIG_GOLD_TROPHY;
    } else if (score > 7000) {
      return ImageTypes.LEGEND_TROPHY;
    }
  }

  popTrophy(value) {
    let newScale = 2 / (1 + Math.pow(1.05, -value));
    console.log('value', value);
    this.currentTrophy = this.getTrophy(this.state.totalScore);

    Animated.sequence([
      Animated.timing(this.state.trophyScale, {
        toValue: newScale,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.trophyScale, {
        toValue: 1,
        friction: 2,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }

  updateScore(gameState) {
    const {value, quantity, turnOver, gameOver} = gameState;
    let adjustedValue = Math.sqrt(value * quantity);
    this.setState({totalScore: this.state.totalScore + value * quantity});
    this.setState({scoreFromLastTurn: '+' + value * quantity});
    if (gameOver) {
      this.endGame();
    }
  }

  componentWillMount() {
    this.state.gameModalLocation.setValue({
      x: 0,
      y: -windowHeight,
    });

    this.dropSelectLevelModal();
  }

  goBack() {
    const {navigate} = this.props.navigation;
    navigate('Root');
  }

  justPlayGame() {
    this.instructionsCompleted = true;
    this.hideModal();
  }

  gameModalContent(i) {
    return (
      <View style={styles.gameModalContainer}>
        <View style={{flexDirection: 'row'}}>
          <Image source={this.currentTrophy} style={styles.finalTrophy} />
        </View>
        <View>
          <Image source={ImageTypes.TROPHY_GALLERY} style={styles.trophyGallery} />
        </View>
        <View style={styles.modalButtonsRow}>
          <TouchableHighlight underlayColor={'white'} style={styles.playAgainButton} onPress={() => this.goBack()}>
            <Text style={styles.playAgainButtonText}>Play Again!</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    const {navigate} = this.props.navigation;

    let [translateX, translateY] = [this.state.tuffysHeadLocation.x, this.state.tuffysHeadLocation.y];

    let scale = this.state.tuffysHeadScale;

    let backButton = (
      <TouchableOpacity underlayColor={'white'} style={styles.backButton} onPress={() => this.goBack()}>
        <Image style={styles.backButtonImage} source={ImageTypes.BACKARROW} />
      </TouchableOpacity>
    );

    let topOfTuffyComponent = (
      <Animated.View style={[styles.tuffysHeadContainer, {transform: [{translateX}, {translateY}, {scale}]}]}>
        <Image style={styles.tuffysHead} source={ImageTypes.TOPOFTUFFYSHEAD} />
      </Animated.View>
    );

    [translateX, translateY] = [this.state.gameModalLocation.x, this.state.gameModalLocation.y];

    scale = this.state.gameModalScale;

    let gameModal = <Animated.View style={[styles.gameOverModal, {transform: [{translateX}, {translateY}, {scale}]}]}>{this.gameModalContent(this.state.modalIndex)}</Animated.View>;

    // TODO: D.R.Y.
    const header = gameOver => {
      if (!gameOver) {
        return (
          this.state.currentLevel != null && (
            <View style={styles.topBar}>
              {backButton}
              <Animated.Image
                source={this.currentTrophy}
                style={[
                  styles.normalTile,
                  {
                    transform: [{translateX: this.state.trophyLocation.x}, {translateY: this.state.trophyLocation.y}, {scale: this.state.trophyScale}],
                  },
                ]}></Animated.Image>
              <View style={styles.turnIndicator}>
                <TurnIndicator scale={this.state.turnScale} text={this.state.numberOfMoves} />
              </View>
            </View>
          )
        );
      } else {
        return (
          <View style={styles.topBar}>
            {backButton}
            <TurnIndicator scale={this.state.turnScale} text={''} />
          </View>
        );
      }
    };

    const numberLine = <Image style={styles.numberLine} source={NumberLine} />;

    return (
      <ImageBackground source={justClouds} style={styles.backGroundImage}>
        {header(this.gameOver)}
        <View style={styles.gridContainer}>
          <ChunksGrid
            popTrophy={value => this.popTrophy(value)}
            gameOver={this.gameOver}
            topMargin={this.topMargin}
            animateTuffysHead={this.animateTuffysHead.bind(this)}
            updateScore={this.updateScore.bind(this)}
            currentLevel={this.state.currentLevel}
            incrementTurns={this.incrementTurns.bind(this)}
            {...this.props}
          />
        </View>
        <PickLevelModal selectLevel={this.selectLevel.bind(this)} location={this.state.xyLevelModal} style={styles.pickLevelModal} />
        {gameModal}
      </ImageBackground>
    );
  }
}

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
  gameModalContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#ffffff',
  },
  gameModalImage: {
    width: 6 * TILE_WIDTH,
    height: 6 * TILE_WIDTH,
    borderRadius: TILE_WIDTH / 2,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  backButton: {
    flex: 1,
    height: TILE_WIDTH,
    justifyContent: 'center',
  },
  backButtonImage: {
    height: 0.5 * TILE_WIDTH,
    width: 0.5 * TILE_WIDTH,
  },
  backGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBarAndGridContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    height: 5 * TILE_WIDTH,
    width: 5 * TILE_WIDTH,
    alignItems: 'center',
    marginTop: windowHeight / 2 - 4 * TILE_WIDTH,
  },
  topBar: {
    marginTop: TILE_WIDTH / 2,
    //marginTop: 1/2*(1/2*windowHeight - TILE_WIDTH*5/2)-TILE_WIDTH/2,
    height: TILE_WIDTH * 1.1,
    width: 5.5 * TILE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  turnIndicator: {
    flexDirection: 'row',
    flex: 0.2,
    marginRight: 0,
  },
  text: {
    flex: 5,
    //backgroundColor: "#ff51f3",
    textAlign: 'center',
    fontFamily: 'ChalkboardSE-Regular',
    fontSize: TILE_WIDTH / 1.5,
    //alignItems: "center"
    //backgroundColor: "blue"
    //color       : '#fff'
  },
  finalTrophy: {
    height: windowWidth,
    width: windowWidth,
    //backgroundColor: "pink"
  },
  finalScoreText: {
    flex: 1,
    marginTop: 2 * TILE_WIDTH,
    textAlign: 'center',
    fontFamily: 'ChalkboardSE-Regular',
    fontSize: TILE_WIDTH / 1.5,
    alignItems: 'center',
  },
  gameOverModal: {
    position: 'absolute',
    height: 7 * TILE_WIDTH,
    width: 6 * TILE_WIDTH,
    flexDirection: 'column',
  },
  trophyGallery: {
    height: TILE_WIDTH,
    width: '100%',
  },
  finalScoreModal: {
    height: 2 * TILE_WIDTH,
    backgroundColor: white,
    borderRadius: TILE_WIDTH / 5,
  },
  tuffysHeadContainer: {
    position: 'absolute',
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH,
    //backgroundColor: "#c00ffe"
  },
  tuffysHead: {
    position: 'absolute',
    height: 2 * TILE_WIDTH,
    width: 3 * TILE_WIDTH,
    //backgroundColor: "#c00ffe"
  },
  nextButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TILE_WIDTH / 1.5,
    borderRadius: TILE_WIDTH / 5,
  },
  playAgainButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TILE_WIDTH / 1.5,
    //backgroundColor: "blue",
    //borderRadius: TILE_WIDTH / 5,
    //borderWidth: TILE_WIDTH / 80
  },
  justPlayButtonText: {
    fontSize: TILE_WIDTH / 3,
    fontFamily: 'ChalkboardSE-Regular',
    color: '#9135EE',
  },
  modalButtonText: {
    fontSize: TILE_WIDTH / 3,
    color: '#FFF65F',
    fontFamily: 'ChalkboardSE-Regular',
  },
  playAgainButtonText: {
    fontSize: TILE_WIDTH / 3,
    fontFamily: 'ChalkboardSE-Regular',
  },
  pickLevelModal: {
    position: 'absolute',
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5.5,
    justifyContent: 'center',
  },
  dropInModal: {
    position: 'absolute',
    width: TILE_WIDTH * 5.5,
    height: TILE_WIDTH * 1.25,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: white,
    borderColor: 'gray',
    borderWidth: 5,
  },
  justPlayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TILE_WIDTH / 1.5,
    borderRadius: TILE_WIDTH / 5,
  },
  numberLineBackGround: {
    marginTop: 0.25 * TILE_WIDTH,
    marginBottom: 0.25 * TILE_WIDTH,
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 0.5,
  },
  normalTile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH,
    position: 'absolute',
  },
});

function mapStateToProps(state) {
  return {
    level: state.levelReducer,
  };
}

module.exports = connect(mapStateToProps)(ChunksGameScreen);
