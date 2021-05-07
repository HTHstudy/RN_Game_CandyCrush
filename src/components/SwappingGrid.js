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
  TouchableHighlight,
  ImageBackground
} from "react-native";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import Tile from "./Tile";

import {
  ImageTypes,
  CardTypes,
  Types,
  getLevelSeqence,
  initVisualCardsWPropsForLevel,
  initNumCardsWPropsForLevel,
  getObjectsForCardType,
  initAllNumbers,
  getLevel
} from "../components/ImageTypes";

import {
  getJamJarFromBean,
  isCandy,
  getCandyFromBean,
  isJam
} from "../components/JamFunctions";

import { NUMBER_SHAPES, initAllNumberShapes } from "../components/ImageTypes";

import {
  getRandomInt,
  testRemoveIndexPair,
  testRemoveIndexes,
  flattenArrayToPairs,
  returnAllMatchesWithIndex,
  removeAllMatchesWithIndex
} from "../grid-api/Methods";

let firstLoad = true;

let boardWidth = 5;
let boardHeight = 5;

let speed = 300;

class TileData {
  constructor(assetObj, key) {
    // The number of matches that a tile exits within.
    this.matchMemberships = 0;
    this.value = assetObj.value;
    this.fadeAnimation = new Animated.Value(1);
    this.key = key;
    this.selected = false;
    this.assetObj = assetObj;
    this.location = new Animated.ValueXY();
    this.image = assetObj.img;
    this.rotation = new Animated.Value(0);
    this.scale = new Animated.Value(1);
    this.explored = true;
  }

  setAsset(obj) {
    this.assetObj = obj;
    this.value = obj.value;
    this.image = obj.img;
  }
}

const animationType = {
  SWAP: 0,
  FALL: 1
};

const rowOrCol = {
  ROW: 0,
  COLUMN: 1
};

export default class Swappables extends Component<{}> {
  constructor(props) {
    super(props);

    console.log("this.props.level inside swappable grid", this.props.level);
    this.visualCardsWithProps = [];
    this.numCardsWithProps = initNumCardsWPropsForLevel(3);

    // Inititalize to swipe up, will change later.
    this.swipeDirection = swipeDirections.SWIPE_UP;
    this.isCandy = false;
    this.currentIJ = {};
    this.nextIJ = {};
    this.crunchThisImage = ImageTypes.REDJELLYBEAN;
    this.crunchTheseIfCandy = new Array([[0, 0]]);
    this.turnsThisLevel = 0;
    this.beansThisLevel = 0;
    this.currentLevelIndex = 0;

    // NOTE New Variables for new game:
    this.numberOfSelected = 0;
    this.selectedIndexes = [];
    this.jar = null;

    // Speed of the animations
    this.speed = 100; // Rate at which the animation occurs.
    this.origin = [];
    this.animationState = animationType.SWAP;
    this.currentDirection = rowOrCol.ROW;
    this.otherDirection = rowOrCol.COLUMN;
    this.cancelTouches = false;
    this.consecutiveSwaps = 1;
    this.potentialMatch = [];
    this.firstLoad = true;

    this.previousSwappedIndexes = [];
    this.shouldReimburseForSwap = true;

    this.state = {
      tileComponents: [],
      tileDataSource: []
    };
  }

  onSwipe(gestureName, gestureState) {
    if (this.cancelTouches == false && this.props.gameOver == false) {
      let initialGestureX = gestureState.x0;
      let initialGestureY = gestureState.y0;

      // Need to get convert location of swipe to an index.

      let i = Math.round((initialGestureX - TILE_WIDTH) / TILE_WIDTH);
      let j = Math.round(
        (initialGestureY -
          this.props.topMargin -
          this.origin[1] -
          0.5 * TILE_WIDTH) /
          TILE_WIDTH
      );

      const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
      this.setState({ gestureName: gestureName });

      //  TODO: Make sure that the boundary conditions 0 and 4 aren't HARDCODED
      switch (gestureName) {
        case SWIPE_UP:
          if (j > 0) {
            this.swipeDirection = SWIPE_UP;
            this.swap(i, j, 0, -1);
          }

          break;
        case SWIPE_DOWN:
          if (j < 4) {
            this.swipeDirection = SWIPE_DOWN;
            this.swap(i, j, 0, 1);
          }

          break;
        case SWIPE_LEFT:
          if (i > 0) {
            this.swipeDirection = SWIPE_LEFT;
            this.swap(i, j, -1, 0);
          }

          break;
        case SWIPE_RIGHT:
          if (i < 4) {
            this.swipeDirection = SWIPE_RIGHT;
            this.swap(i, j, 1, 0);
          }
          break;
      }
    }
  }

  // data - the array of
  renderTiles() {
    if (this.firstLoad) {
      this.firstLoad = false;
      console.log("current Level", this.props.currentLevel);
      this.visualCardsWithProps = getLevelSeqence();
      this.visualCardsWithProps = this.visualCardsWithProps.filter(
        e =>
          e.value <= 6 + this.props.currentLevel &&
          e.value >= this.props.currentLevel
      );
      console.log(
        "visualCardsWithProps length",
        this.visualCardsWithProps.length
      );
      this.state.tileDataSource = this.initializeDataSource();
      let components = [];
      // This creates the array of Tile components that is stored as a state variable.
      this.state.tileDataSource.map((row, i) => {
        let rows = row.map((e, j) => {
          components.push(
            <Tile
              location={e.location}
              scale={e.scale}
              key={e.key}
              rotation={e.rotation}
              img={e.image}
              onTouch={this.onTouch.bind(this)}
              indices={[i, j]}
              selected={e.selected}
            />
          );
        });
        // This is where the error occurs where an element no longer receives touches.
        // Don't wrap this in a view.
        return;
        rows;
      });
      this.animateValuesToLocationsWaterfalStyle();
      return components;
    } else {
      let components = [];
      // This creates the array of Tile components that is stored as a state variable.
      this.state.tileDataSource.map((row, i) => {
        let rows = row.map((e, j) => {
          components.push(
            <Tile
              location={e.location}
              scale={e.scale}
              key={e.key}
              rotation={e.rotation}
              img={e.image}
              onTouch={this.onTouch.bind(this)}
              indices={[i, j]}
              selected={e.selected}
            />
          );
        });
        // This is where the error occurs where an element no longer receives touches.
        // Don't wrap this in a view.
        return;
        rows;
      });
      return components;
    }
  }

  // takes the indexes that will be animated
  animateCandyCrunch(indexesToAnimate) {
    let len = indexesToAnimate.length;

    for (var n = 0; n < len; n++) {
      let e = indexesToAnimate[n];

      let i = e[0];
      let j = e[1];

      Animated.sequence([
        Animated.delay(350),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        })
      ]).start(() => {
        this.animationState = animationType.FALL;
      });
    }
  }

  getNumberOfTypes(match) {
    let types = {};
    match.forEach(e => {
      let i = e[0];
      let j = e[1];
      let type = this.state.tileDataSource[i][j].assetObj.type;
      if (types[type]) {
      } else {
        types[type] = 1;
      }
    });
    return Object.keys(types).length;
  }

  // takes the indexes that will be animated and
  animateBeanMatch(indexesToAnimate, location, jar) {
    let locationToAnimateTo = [
      location[0] * TILE_WIDTH,
      location[1] * TILE_WIDTH
    ];

    let len = indexesToAnimate.length;

    for (var n = 0; n < len; n++) {
      let e = indexesToAnimate[n];

      let i = e[0];
      let j = e[1];

      /*
      let numeral = this.state.tileDataSource[i][j].assetObj.numeral;
      this.state.tileDataSource[i][j].setAsset(
        this.state.tileDataSource[i][j].assetObj.numeral
      );
*/
      console.log("HOLY SHIT IS THIS WORKING???");

      //this.setState({tileDataSource: this.state.tileDataSource})
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1.05,
          duration: 225,
          useNativeDriver: true
        }),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 0,
          duration: 225,
          useNativeDriver: true
        }),
        Animated.timing(this.state.tileDataSource[i][j].location, {
          toValue: { x: locationToAnimateTo[0], y: locationToAnimateTo[1] },
          duration: this.speed,
          useNativeDriver: true
        })
      ]).start(() => {
        this.animationState = animationType.FALL;
        this.state.tileDataSource[location[0]][location[1]].setAsset(jar);
      });
    }
  }

  // takes the indexes that will be animated and
  animateNumberMatch(indexesToAnimate, location) {
    let locationToAnimateTo = [
      location[0] * TILE_WIDTH,
      location[1] * TILE_WIDTH
    ];

    let len = indexesToAnimate.length;

    for (var n = 0; n < len; n++) {
      let e = indexesToAnimate[n];

      let i = e[0];
      let j = e[1];

      Animated.sequence([
        Animated.delay(350),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(this.state.tileDataSource[i][j].scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(this.state.tileDataSource[i][j].location, {
          toValue: { x: locationToAnimateTo[0], y: locationToAnimateTo[1] },
          duration: this.speed,
          useNativeDriver: true
        })
      ]).start(() => {
        this.animationState = animationType.FALL;
      });
    }
  }

  condenseColumns(beanIndexes) {
    let spotsToFill = 0;
    // NOTE: HARDCODED!
    for (let i = 0; i < 5; i++) {
      spotsToFill = 0;

      // Iterate through each column
      for (let j = 4; j >= 0; j--) {
        // NOTE: Wait...there's only one of this. Couldn't I use "containsIndexPair?""
        let indexesToFill = beanIndexes.filter(e => {
          return i == e[0] && j == e[1];
        });

        // Check to see if the element is a spot that needs filling.
        if (indexesToFill.length != 0) {
          // Increment the spots to fill...since we found a spot to fill.
          spotsToFill++;
          // Place the location above the top of the screen for when it "falls"
          this.state.tileDataSource[i][j].location.setValue({
            x: TILE_WIDTH * i,
            y: -3 * TILE_WIDTH
          });
          this.state.tileDataSource[i][j].scale.setValue(1);
        } else if (spotsToFill > 0) {
          // Move bean downward
          const currentSpot = this.state.tileDataSource[i][j];
          const newSpot = this.state.tileDataSource[i][j + spotsToFill];

          this.state.tileDataSource[i][j] = newSpot;
          this.state.tileDataSource[i][j + spotsToFill] = currentSpot;
        }
      }
    }
  }

  sharedIndex(arrOne, arrTwo) {
    let match = [];
    arrOne.map((u, i) => {
      arrTwo.map((v, j) => {
        if (u[0] == v[0] && u[1] == v[1]) {
          match = u;
        }
      });
    });
    return match;
  }

  // Test console.log("What index do each of these two arrays share? [[2,3],[2,4],[2,5]]  [[1,3],[2,3],[2,3] ]",this.shareIndex([[2,3],[2,4],[2,5]], [[2,3],[2,4],[2,5]]))

  containsIndexPair(arr, pair) {
    let a = arr.filter(e => e[0] == pair[0] && e[1] == pair[1]);
    return a.length !== 0;
  }

  //Remove the spot where the jar needs to go
  removeIndexes(arr, indexes) {
    let filteredArray = [];

    if (indexes.length == 0) {
      return arr;
    } else {
      indexes.map(index => {
        filteredArray = arr.filter(e => {
          // Not sure how all this got to be.
          // Somehow this was the only way to do this.
          let firstAreEqual = e[0] == index[0];
          let secondAreEqual = e[1] == index[1];
          b = !(firstAreEqual && secondAreEqual);

          return b;
        });
        //NOTE: this used to be arr = filteredArray and worked fine
        arr = filteredArray;
      });
      return filteredArray;
    }
  }

  swap(i, j, dx, dy) {
    let swipeBeganAt = [i, j];
    let swipeDirectedAt = [i + dx, j + dy];

    this.currentIJ = swipeBeganAt;
    this.nextIJ = swipeDirectedAt;

    if (
      this.containsIndexPair(this.previousSwappedIndexes, swipeBeganAt) &&
      this.containsIndexPair(this.previousSwappedIndexes, swipeDirectedAt)
    ) {
      console.log("Need to give swap back");
      this.consecutiveSwaps += 1;

      let inc = Math.pow(-1, this.consecutiveSwaps);
      console.log("increment", inc);
      this.props.incrementTurns(inc);
      this.turnsThisLevel += inc;
    } else {
      console.log("Don't need to give swap back");
      this.consecutiveSwaps = 1;
      this.props.incrementTurns(-1);
      this.turnsThisLevel += -1;
    }

    // Log the previous indexes
    this.previousSwappedIndexes = [swipeBeganAt, swipeDirectedAt];

    const newData = this.state.tileDataSource;

    const swapStarter = this.state.tileDataSource[i][j];
    const swapEnder = this.state.tileDataSource[i + dx][j + dy];

    Animated.parallel([
      Animated.timing(swapStarter.location, {
        toValue: { x: TILE_WIDTH * (i + dx), y: TILE_WIDTH * (j + dy) },
        duration: 120,
        useNativeDriver: true
      }),
      Animated.timing(swapEnder.location, {
        toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
        duration: 120,
        useNativeDriver: true
      })
    ]).start(() => this.updateGrid());

    /* NOTE Collect Swap metadata to determine how to manage the candy (now RainbowBean)
    if (this.isCandy = isCandy(swapStarter.imageType)){
      this.crunchThisImage = swapEnder.imageType
      this.crunchTheseIfCandy = this.getIndexesWithColor(this.crunchThisImage)
      this.crunchTheseIfCandy.push(this.currentIJ)
    } else if (this.isCandy = isCandy(swapEnder.imageType)){
      this.crunchThisImage = swapStarter.imageType
      this.crunchTheseIfCandy = this.getIndexesWithColor(this.crunchThisImage)
      this.crunchTheseIfCandy.push(this.nextIJ)
    }
    */

    // Perform the swap - this calls "Component did update" - I think.
    newData[i][j] = swapEnder;
    newData[i + dx][j + dy] = swapStarter;
  }

  // Handles swipe events
  updateGrid() {
    // The amount of jam and numbers of beans gathered in this swipe.
    let beansThisTurn = 0;
    let jamThisTurn = 0;

    let allMatches = this.allMatchesOnBoard();
    let typeReducer = (acc, val) => acc + this.getNumberOfTypes(val);
    let typeCount = allMatches.reduce(typeReducer, 0);
    console.log("TYPE COUNT", typeCount);

    let scoreReducer = (acc, e) => {
      let lengthOfMatch = e.length;
      let i = e[0][0];
      let j = e[0][1];
      console.log("IJ", i, j);
      let val = this.state.tileDataSource[i][j].assetObj.value;
      let points = lengthOfMatch * val;
      return acc + points;
    };
    let score = allMatches.reduce(scoreReducer, 0);
    console.log("SCORE", score);
    this.props.updateScore(score, this.visualCardsWithProps.length);

    if (typeCount > 1) {
      this.props.incrementTurns(typeCount - 1);
    }

    allMatches.forEach(m => {
      m.forEach(e => {
        let i = e[0];
        let j = e[1];
        this.state.tileDataSource[i][j].setAsset(
          this.state.tileDataSource[i][j].assetObj.numeral
        );
      });
    });

    console.log("setting state!");
    this.setState({ tileDataSource: this.state.tileDataSource });

    // CANDY MEANS RAINBOW BEAN!
    if (this.isCandy) {
      this.cancelTouches = true;

      if (isJam(this.crunchThisImage)) {
        jamThisTurn = this.crunchTheseIfCandy.length; // crunchTheseIfCandy contains
        // the index of the rainbow bean so we have to subtract one.
        this.props.incrementTurns(jamThisTurn);
      } else {
        beansThisTurn = (this.crunchTheseIfCandy.length - 1) * 5;

        this.props.incrementTurns(1);
      }

      this.animateCandyCrunch(this.crunchTheseIfCandy);

      setTimeout(() => {
        this.recolorMatches(this.crunchTheseIfCandy);
        this.condenseColumns(this.crunchTheseIfCandy);
        this.setState({ tileDataSource: this.state.tileDataSource });
        this.animateValuesToLocationsWaterfalStyle();
        this.animationState = animationType.SWAP;

        setTimeout(() => {
          if (this.allMatchesOnBoard().length != 0) {
            this.isCandy = false;
            this.updateGrid();
          } else {
            this.cancelTouches = false;
            this.animationState = animationType.SWAP;
          }
        }, 1200);
      }, 1200);
    } else if (allMatches.length != 0) {
      this.cancelTouches = true;
      // Previousy swapped indexes stores the indexes that were most
      // recently swapped to determine if turn reimbursement
      // is necessary. This gets reset after match.
      this.previousSwappedIndexes = [];
      let duplicates = this.returnDuplicates(allMatches);

      // These are the indexes that were matched and need to be replaced with new beans
      let indexesToRemove = [];
      if (duplicates.length == 1) {
        const withSharedIndexes = duplicates.map(e => {
          let allWithIndex = returnAllMatchesWithIndex(allMatches, e);
          if (allWithIndex.length > 0) {
            return allWithIndex;
          } else {
            return [];
          }
        });

        const withoutSharedIndexes = duplicates.map(e => {
          let allWithOutIndex = removeAllMatchesWithIndex(allMatches, e);
          if (allWithOutIndex.length > 0) {
            return allWithOutIndex;
          } else {
            return [];
          }
        });

        withSharedIndexes.map((row, i) => {
          // This reduces the beans this turn by one to account for the shared index being counted twice
          beansThisTurn = beansThisTurn - withSharedIndexes.length;

          // Animate to the index that they share
          let animateTo = this.sharedIndex(row[0], row[1]);

          row.map(match => {
            // Get the indexs of the first item
            let i = match[0][0];
            let j = match[0][1];
            let currentObject = this.state.tileDataSource[i][j].assetObj;
            let currentImage = this.state.tileDataSource[i][j].imageType;

            if (currentObject.type == CardTypes.num) {
              this.animateNumberMatch(match, [2.5, -4]);
              // NOTE replace the above line with a seperate animate function for when we make a match of numbers.
              jamThisTurn += match.length;
            } else {
              this.animateBeanMatch(match, animateTo, currentObject.numeral);
              beansThisTurn += match.length;
              //indexesToRemove.push(animateTo);
            }
          });
        });

        // Check to see if the first match in the set of those withoutSharedIndexes is zero.
        if (withoutSharedIndexes[0].length != 0) {
          withoutSharedIndexes.map((row, i) => {
            // This reduces the beans this turn by one to account for the shared index being counted twice
            beansThisTurn = beansThisTurn - withSharedIndexes.length;
            // Animate to the index that they share
            let animateTo = row[0][0];
            console.log("animateTo in withoutSharedIndexes", animateTo);

            row.map(match => {
              // Get the indexs of the first item
              let i = match[0][0];
              let j = match[0][1];
              let currentAsset = this.state.tileDataSource[i][j].assetObj;

              this.animateBeanMatch(match, animateTo, currentAsset.numeral);
              beansThisTurn += match.length;
              //indexesToRemove.push(animateTo);
            });
          });
        }
      } else {
        allMatches.map(match => {
          let u = match[0][0];
          let v = match[0][1];
          let currentAsset = this.state.tileDataSource[u][v].assetObj;

          // Retreive first index in match
          if (this.allAreNumbers(match)) {
            this.animateNumberMatch(match, [2, -8]);
            this.props.incrementTurns(4);
            jamThisTurn += match.length;
          } else {
            // Give them candy if the match is greater than 3.
            if (match.length > 3) {
              this.state.tileDataSource[u][v].setAsset(currentAsset.numeral);
            } else {
              //this.state.tileDataSource[u][v].setAsset(currentAsset.numeral)
            }
            this.jar = currentAsset.numeral;
            // This completion handler for animated bean match will set the asset.
            this.animateBeanMatch(match, match[0], currentAsset.numeral);
            beansThisTurn += match.length;
            //indexesToRemove.push(match[0]);
          }
        });
      }

      // Everytime you get jam match you get extra turns.
      if (jamThisTurn > 0) {
        this.props.incrementTurns(2 * (jamThisTurn - 2));
      }

      // TODO: Flatten all matches before...wait...what about duplicate indexes?
      // Duplicate indexes will never need removal!!!!!
      allMatches = allMatches.map(match => {
        return this.removeIndexes(match, indexesToRemove);
      });

      // Waits for "animate match" to complete.
      setTimeout(() => {
        allMatches.map(match => {
          this.recolorMatches(match);
          this.condenseColumns(match);
        });
        this.setState({ tileDataSource: this.state.tileDataSource });
        this.animateValuesToLocationsWaterfalStyle();

        setTimeout(() => {
          if (this.allMatchesOnBoard().length != 0) {
            console.log("Hello! Calling update grid again");
            this.updateGrid();
          } else {
            this.cancelTouches = false;
            this.animationState = animationType.SWAP;
            this.beansThisLevel += beansThisTurn;
            console.log("beans this level", this.beansThisLevel);
          }
        }, 1200);
      }, 1200);
    }
  }

  componentDidUpdate() {
    // !!! Make this take a "Type" and perform an animation based on the
    // type of update that's occured. ie swipe, condense, load.
    /*
    console.log("component did update was called");
    switch (this.animationState) {
      case animationType.SWAP:
        this.animateValuesToLocationsSwapStyle();
        break;
      case animationType.FALL:
        this.animateValuesToLocationsWaterfalStyle();
        break;
    }
    */
  }

  initializeDataSource() {
    // Grid that contains the keys that will be assigned to each tile via map
    let keys = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ];

    var tileData = keys.map((row, i) => {
      let dataRows = row.map((key, j) => {
        let randInt = getRandomInt(36 - this.turnsThisLevel);
        let newAsset = this.visualCardsWithProps.shift();
        let data = new TileData(newAsset, key);
        return data;
      });
      return dataRows;
    });
    return tileData;
  }

  componentWillMount() {
    //this.animateValuesToLocationsWaterfalStyle();
  }

  onLayout(event) {
    this.origin = [event.nativeEvent.layout.x, event.nativeEvent.layout.y];
    console.log("this is the origin", this.origin);
  }

  isMatch(itemOne, itemTwo) {
    let bothNums =
      itemOne.type == CardTypes.num && itemTwo.type == CardTypes.num;
    let atLeastOneIsNum =
      itemOne.type == CardTypes.num || itemTwo.type == CardTypes.num;
    let onlyOneIsNum = !bothNums && atLeastOneIsNum;

    if (itemOne.value == itemTwo.value) {
      return true;
    } else {
      return false;
    }
  }

  checkRowColForMatch(coordinate, direction) {
    let consecutives = [];

    for (i = 0; i < 4; i++) {
      // If its a column,check the next item in the column
      // Inistialize these to zero and then decide which one will be iterated and which will be held consant.
      let x = 0;
      let y = 0;

      // Used to whether the next itme should be on the left or on the right.
      let dx = 0;
      let dy = 0;

      if (direction == rowOrCol.COLUMN) {
        x = coordinate[0];
        y = i;
        dy = 1;
      } else if (direction == rowOrCol.ROW) {
        x = i;
        dx = 1;
        y = coordinate[1];
      }

      let firstItem = this.state.tileDataSource[x][y].assetObj;
      let nextItem = this.state.tileDataSource[x + dx][y + dy].assetObj;

      if (this.isMatch(firstItem, nextItem)) {
        consecutives.push([x, y]);

        // Check if I've reached the end of the loop.
        if (i == 3) {
          consecutives.push([x + dx, y + dy]);
        }
      } else {
        // Push the last item in the sequence of matches
        consecutives.push([x, y]);
        if (consecutives.length >= 3) {
          console.log("returning consecutives");
          return consecutives;
        } else {
          // Reset
          consecutives = [];
        }
      }
    }

    if (consecutives.length >= 3) {
      return consecutives;
    } else {
      return [];
    }
  }

  areIndexesEqual(pairOne, pairTwo) {
    return a[0] == e[0] && a[1] == e[1];
  }

  // Returns all arrays that have an index of "index" within them. For two dimensional array.
  allWithIndex(arr, index) {
    let withIndex = [];
    arr.map(row => {
      if (this.containsIndexPair(row, index)) {
        withIndex.push(row);
      }
    });
    return withIndex;
  }

  returnDuplicates(arr) {
    // Destructure the two dimensional array to a 1D NOTE: I have a function for this now!
    let stream = [];
    arr.map(row => {
      row.map(e => {
        stream.push(e);
      });
    });

    let dups = [];
    let x = stream.map((e, i) => {
      if (stream.slice(i).length > 1) {
        let iterator = stream.slice(i + 1);

        if (this.containsIndexPair(iterator, e)) {
          dups.push(e);
        }
      }
    });
    return dups;
  }

  removeDuplicates(arr) {
    let x = arr.map((e, i) => {
      let iterator = x.slice(i);
      if (this.containsIndexPair(iterator, e)) {
        arr.splice(0, 1);
      }
    });

    return arr;
  }

  allMatchesOnBoard() {
    let matches = [];

    for (let i = 0; i < 5; i++) {
      // Check to find all the rows that have matches.
      let rowMatch = this.checkRowColForMatch([0, i], rowOrCol.ROW);
      if (rowMatch.length > 0) {
        matches.push(rowMatch);
      }
      // Check to find all the columns that have matches
      let colMatch = this.checkRowColForMatch([i, 0], rowOrCol.COLUMN);
      if (colMatch.length > 0) {
        matches.push(colMatch);
      }
    }

    return matches;
  }

  // Gets all indexes with a specific color.
  getIndexesWithColor(color) {
    let colorIndexes = new Array();

    let x = this.state.tileDataSource.map((row, i) => {
      let colorRow = row.map((e, j) => {
        if (e.imageType == color) {
          colorIndexes.push([i, j]);
        } else if (isJam(e.imageType) && isJam(color)) {
          colorIndexes.push([i, j]);
        }
      });
    });
    return colorIndexes;
  }

  // Animates the values in the tile data source based on their index in the array.
  animateValuesToLocationsSwapStyle() {
    this.state.tileDataSource.map((row, i) => {
      row.map((elem, j) => {
        Animated.spring(elem.location, {
          toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
          friction: 4,
          useNativeDriver: true
        }).start();
      });
    });
  }

  // Animates the values in the tile data source based on their index in the array.
  animateValuesToLocationsWaterfalStyle() {
    this.state.tileDataSource.map((row, i) => {
      row.map((elem, j) => {
        Animated.sequence([
          Animated.spring(
            //Step 1
            elem.location, //Step 2
            {
              toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
              friction: 4,
              useNativeDriver: true
            } //Step 3
          )
        ]).start(() => {});
      });
    });
  }

  // Weird name

  recolorMatches(neighbors) {
    neighbors.map(e => {
      let i = e[0];
      let j = e[1];
      console.log("this.beansThisLevel", this.beansThisLevel);
      console.log("current level index", this.currentLevelIndex);
      if (this.beansThisLevel > 36) {
        this.beansThisLevel = 0;
      }
      let newAssetObj = this.visualCardsWithProps.shift();
      this.state.tileDataSource[i][j].setAsset(newAssetObj);
      this.state.tileDataSource[i][j].selected = false;
    });
  }

  onTouch(indices) {
    /*
      let i = indices[0]
      let j = indices[1]


      Animated.sequence([
      Animated.timing(this.state.tileDataSource[i][j].scale, {
        toValue: 1.25,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.spring(this.state.tileDataSource[i][j].scale, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true
      })]).start()

      if (!this.cancelTouches) {
      this.cancelTouches = true

      let potentialValue = this.state.tileDataSource[i][j].value
      this.state.tileDataSource[i][j].selected = !this.state.tileDataSource[i][j].selected
      this.setState({tileDataSource: this.state.tileDataSource})

      this.potentialMatch.push([i,j])

      const animateIncorrectMatch = Animated.sequence([
      Animated.timing(this.state.tileDataSource[i][j].scale, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.spring(this.state.tileDataSource[i][j].scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      })])

        if (this.state.tileDataSource[i][j].selected == true){
          this.numberOfSelected += 1
        } else {
          this.potentialMatch = []
          this.numberOfSelected -= 1
        }

        this.selectedIndexes = this.getSelected()
        this.numberOfSelected = this.selectedIndexes.length


        let potentialBonus = 0
        if (this.potentialMatch.length == 2) {
          if (this.checkMatch(this.selectedIndexes)) {
            potentialBonus = this.computeNumberBonus(this.selectedIndexes)


            const animateCorrectMatch =
                  Animated.parallel([
                  Animated.timing(this.state.tileDataSource[this.potentialMatch[0][0]][this.potentialMatch[0][1]].scale, {
                    toValue: 1.25,
                    duration: 250,
                    useNativeDriver: true
                  }),
                  Animated.timing(this.state.tileDataSource[this.potentialMatch[1][0]][this.potentialMatch[1][1]].scale, {
                    toValue: 1.25,
                    duration: 250,
                    useNativeDriver: true
                  })
            ])

            animateCorrectMatch.start(()=>{
              this.props.updateScore(potentialValue,potentialValue)
              this.recolorMatches(this.selectedIndexes)
              this.condenseColumns(this.selectedIndexes)
              this.setState({tileDataSource: this.state.tileDataSource})
              this.animateValuesToLocationsWaterfalStyle()
              this.numberOfSelected = 0
              this.selectedIndexes = []
              this.updateGrid()
              this.cancelTouches = false
              this.potentialMatch = []
            })
          } else {
              this.clearMatch(this.selectedIndexes)
              this.numberOfSelected = 0
              this.selectedIndexes = []
              this.cancelTouches = false
              this.potentialMatch = []
          }

          if (potentialBonus == 0) {
            this.props.incrementTurns(-1)
          } else {
            this.props.incrementTurns(potentialBonus)
          }

        } else {
          this.cancelTouches = false
        }

    }
    */
  }

  // NOTE: These functions are absurd.
  checkMatch(indexes) {
    let firstIndex = indexes[0];
    let secondIndex = indexes[1];
    let iF = firstIndex[0];
    let jF = firstIndex[1];
    let iS = secondIndex[0];
    let jS = secondIndex[1];

    if (
      this.state.tileDataSource[iF][jF].value ==
      this.state.tileDataSource[iS][jS].value
    ) {
      return true;
    } else {
      return false;
    }
  }

  allAreNumbers(match) {
    let areNumbers = true;
    if (match.length == 0) {
      return false;
    }
    console.log("match", match);
    match.map(e => {
      if (
        this.state.tileDataSource[e[0]][e[1]].assetObj.type != CardTypes.num
      ) {
        areNumbers = false;
      }
    });
    return areNumbers;
  }

  computeNumberBonus(indexes) {
    let firstIndex = indexes[0];
    let secondIndex = indexes[1];
    let iF = firstIndex[0];
    let jF = firstIndex[1];
    let iS = secondIndex[0];
    let jS = secondIndex[1];

    let bonus = 0;

    if (this.state.tileDataSource[iF][jF].assetObj.type == Types.NUMERAL) {
      bonus += 1;
    }

    if (this.state.tileDataSource[iS][jS].assetObj.type == Types.NUMERAL) {
      bonus += 1;
    }
    return bonus;
  }

  clearMatch(indexes) {
    let firstIndex = indexes[0];
    let secondIndex = indexes[1];
    let iF = firstIndex[0];
    let jF = firstIndex[1];
    let iS = secondIndex[0];
    let jS = secondIndex[1];

    this.state.tileDataSource[iF][jF].selected = false;
    this.state.tileDataSource[iS][jS].selected = false;
    this.setState({ tileDataSource: this.state.tileDataSource });
  }

  getSelected() {
    let selected = [];
    this.state.tileDataSource.forEach((row, i) => {
      row.forEach((e, j) => {
        if (e.selected) {
          selected.push([i, j]);
        }
      });
    });
    return selected;
  }

  render() {
    const config = {
      velocityThreshold: 0.11,
      directionalOffsetThreshold: 50,
      gestureIsClickThreshold: 5
    };

    return (
      <GestureRecognizer
        onLayout={this.onLayout.bind(this)}
        config={config}
        style={styles.gestureContainer}
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
      >
        {this.props.currentLevel != null && this.renderTiles()}
      </GestureRecognizer>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 6;

let windowWidth = Window.width;
let windowHeight = Window.height;

let blue = "#4286f4";
let red = "#f24646";
let yellow = "#faff7f";
let green = "#31a51a";
let orange = "#ff7644";
let pink = "#ff51f3";

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: 300,
    height: 300
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  mainView: {
    flex: 1,
    alignItems: "center"
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: red
  },
  gestureContainer: {
    flex: 1,
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5,
    position: "absolute"
    //backgroundColor: "#31a51a"
  },
  container: {
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5
    //backgroundColor: 'white',
    //backgroundColor: red
  },
  tile: {
    width: 0.9 * TILE_WIDTH,
    height: 0.9 * TILE_WIDTH,
    borderRadius: 10
  }
});
