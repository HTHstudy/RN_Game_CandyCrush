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

import SpeedTile from "./SpeedTile";

import Tile from "./Tile";

import {
  shuffleNumbersWithType,
  getNumbersWithType,
  ImageTypes,
  CardTypes,
  Types,
  NUMERALS,
  initVisualCardsWPropsForLevel,
  initNumCardsWPropsForLevel,
  getObjectsForCardType,
  initAllNumbers,
  getLevel,
  getLevelSeqence
} from "../components/ImageTypes";

import { connect } from "react-redux";

import {
  getJamJarFromBean,
  isCandy,
  getCandyFromBean,
  isJam
} from "../components/JamFunctions";

import { NUMBER_SHAPES, initAllNumberShapes } from "../components/ImageTypes";

import {
  getRandomInt,
  shuffle,
  testRemoveIndexPair,
  testRemoveIndexes,
  flattenArrayToPairs,
  returnAllMatchesWithIndex,
  removeAllMatchesWithIndex
} from "../grid-api/Methods";

let boardWidth = 5;
let boardHeight = 5;

let speed = 300;

const ANIMATION_TYPES = {
  SWAP: 0,
  FALL: 1,
}

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
    this.explored = false;
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

class ChunksGrid extends Component<{}> {
  constructor(props) {
    super(props);


    this.currentLevelIndex = 0;
    this.firstTurn = true

    // Inititalize to swipe up, will change later.
    this.swipeDirection = swipeDirections.SWIPE_UP;
    this.isCandy = false;
    this.currentIJ = {};
    this.nextIJ = {};
    this.crunchThisImage = ImageTypes.REDJELLYBEAN;
    this.crunchTheseIfCandy = new Array([[0, 0]]);

    // NOTE New Variables for new game:
    this.numberOfSelected = 0;
    this.selectedIndexes = [];
    this.jar = null;
    this.firstLoad = true;

    // Speed of the animations
    this.speed = 100; // Rate at which the animation occurs.
    this.origin = [];
    this.animationState = ANIMATION_TYPES.FALL
    this.currentDirection = rowOrCol.ROW;
    this.otherDirection = rowOrCol.COLUMN;
    this.cancelTouches = false;
    this.consecutiveSwaps = 1;

    this.previousSwappedIndexes = [];
    this.shouldReimburseForSwap = true;
    this.numbersFound = [];

    this.state = {
      tileComponents: [],
      tileDataSource: []
    };
  }

  validIndex(i, j) {
    if (i < 0 || i > 4 || j < 0 || j > 4) {
      return false;
    } else {
      return true;
    }
  }

  setShit(){
    this.props.dispatch({
      type: "ADD_ITEM",
      name: "poop"
    });
  }

  exploreAndTag(i, j) {
    let value = this.state.tileDataSource[i][j].assetObj.value;
    this.state.tileDataSource[i][j].explored = true;

    let rightImage = this.validIndex(i + 1, j)
      ? this.state.tileDataSource[i + 1][j].assetObj.value
      : null;
    let leftImage = this.validIndex(i - 1, j)
      ? this.state.tileDataSource[i - 1][j].assetObj.value
      : null;
    let topImage = this.validIndex(i, j - 1)
      ? this.state.tileDataSource[i][j - 1].assetObj.value
      : null;
    let bottomImage = this.validIndex(i, j + 1)
      ? this.state.tileDataSource[i][j + 1].assetObj.value
      : null;

    if (
      rightImage == value &&
      this.state.tileDataSource[i + 1][j].explored == false
    ) {
      this.exploreAndTag(i + 1, j);
    }

    if (
      leftImage == value &&
      this.state.tileDataSource[i - 1][j].explored == false
    ) {
      this.exploreAndTag(i - 1, j);
    }

    if (
      topImage == value &&
      this.state.tileDataSource[i][j - 1].explored == false
    ) {
      this.exploreAndTag(i, j - 1);
    }

    if (
      bottomImage == value &&
      this.state.tileDataSource[i][j + 1].explored == false
    ) {
      this.exploreAndTag(i, j + 1);
    }
  }

  onSwipe(gestureName, gestureState) {
    this.animationState = ANIMATION_TYPES.SWAP
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
      this.setState({
        gestureName: gestureName
      });

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

  componentDidUpdate() {
    this.animateValuesToLocations();
  }

  // data - the array of
  renderTiles() {
    if (this.firstLoad) {
      let levels = [[0,4],[1,5],[3,7],[6,10]]
      let min = levels[this.props.currentLevel-1][0]
      let max = levels[this.props.currentLevel-1][1]
      // console.log("current Level", this.props.currentLevel);
      this.firstLoad = false;
      this.visualCardsWithProps = getLevelSeqence();
      this.visualCardsWithProps = this.visualCardsWithProps.filter(
        e =>
          e.value <= max &&
          e.value >= min
      );
      this.state.tileDataSource = this.initializeDataSource();
      var components = [];
      // This creates the array of Tile components that is stored as a state variable.
      this.state.tileDataSource.map((row, i) => {
        let rows = row.map((e, j) => {
          components.push(
            <SpeedTile
              location={e.location}
              scale={e.scale}
              key={e.key}
              rotation={e.rotation}
              img={e.assetObj.img}
              onTouch={this.onTouch.bind(this)}
              indices={[i, j]}
              selected={e.selected}
            />
          );
        });
        return;
        rows;
      });
      return components;
    } else {
      var components = [];
      // This creates the array of Tile components that is stored as a state variable.
      this.state.tileDataSource.map((row, i) => {
        let rows = row.map((e, j) => {
          components.push(
            <SpeedTile
              location={e.location}
              scale={e.scale}
              key={e.key}
              rotation={e.rotation}
              img={e.assetObj.img}
              onTouch={this.onTouch.bind(this)}
              indices={[i, j]}
              selected={e.selected}
            />
          );
        });
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
          toValue: {
            x: locationToAnimateTo[0],
            y: locationToAnimateTo[1]
          },
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
          toValue: {
            x: locationToAnimateTo[0],
            y: locationToAnimateTo[1]
          },
          duration: this.speed,
          useNativeDriver: true
        })
      ]).start(() => {
        this.animationState = animationType.FALL;
      });
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
      //this.props.incrementTurns(inc);
    } else {
      console.log("Don't need to give swap back");
      this.consecutiveSwaps = 1;
      //this.props.incrementTurns(-1);
    }

    // Log the previous indexes
    this.previousSwappedIndexes = [swipeBeganAt, swipeDirectedAt];

    const newData = this.state.tileDataSource;

    const swapStarter = this.state.tileDataSource[i][j];
    const swapEnder = this.state.tileDataSource[i + dx][j + dy];

    // Perform the swap - this calls "Component did update" - I think.
    newData[i][j] = swapEnder;
    newData[i + dx][j + dy] = swapStarter;

    //this.updateGrid();
  }

  // Handles swipe events
  updateGrid() {
    // The amount of jam and numbers of beans gathered in this swipe.
    let beansThisTurn = 0;
    let jamThisTurn = 0;

    let allMatches = this.allMatchesOnBoard();

    // CANDY MEANS RAINBOW BEAN!
    if (this.isCandy) {
      this.cancelTouches = true;

      if (isJam(this.crunchThisImage)) {
        jamThisTurn = this.crunchTheseIfCandy.length; // crunchTheseIfCandy contains
        // the index of the rainbow bean so we have to subtract one.
        //this.props.incrementTurns(jamThisTurn);
      } else {
        beansThisTurn = (this.crunchTheseIfCandy.length - 1) * 5;
        //this.props.incrementTurns(1);
      }

      this.props.updateScore(beansThisTurn, 3 * jamThisTurn);

      this.animateCandyCrunch(this.crunchTheseIfCandy);

      setTimeout(() => {
        this.recolorMatches(this.crunchTheseIfCandy);
        this.condenseColumns(this.crunchTheseIfCandy);
        this.setState({
          tileDataSource: this.state.tileDataSource
        });
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
              indexesToRemove.push(animateTo);
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
              indexesToRemove.push(animateTo);
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
            //this.props.incrementTurns(4);
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
            indexesToRemove.push(match[0]);
          }
        });
      }

      // Everytime you get jam match you get extra turns.
      if (jamThisTurn > 0) {
        //this.props.incrementTurns(2 * (jamThisTurn - 2));
      }

      this.props.updateScore(beansThisTurn, 3 * jamThisTurn);

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
        this.setState({
          tileDataSource: this.state.tileDataSource
        });
        this.animateValuesToLocationsWaterfalStyle();

        setTimeout(() => {
          if (this.allMatchesOnBoard().length != 0) {
            console.log("Hello! Calling update grid again");
            this.updateGrid();
          } else {
            this.cancelTouches = false;
            this.animationState = animationType.SWAP;
          }
        }, 1200);
      }, 1200);
    }
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
        //let rand = getRandomInt(this.cardCue.length);
        let newAsset = this.visualCardsWithProps.shift();
        let data = new TileData(newAsset, key);
        return data;
      });
      return dataRows;
    });
    return tileData;
  }

  onLayout(event) {
    this.origin = [event.nativeEvent.layout.x, event.nativeEvent.layout.y];
    console.log("this is the origin", this.origin);
  }

  getNumberOfTypes(match) {
    let types = {};
    this.state.tileDataSource.forEach((r, i) => {
      r.forEach((e, j) => {
        let type = e.assetObj.type;
        console.log("type", type);
        let exploredState = e.explored;
        console.log("explored state", exploredState);
        if (exploredState) {
          console.log("typs.type", types[type]);
          if (types[type]) {
            console.log("skipping over");
          } else {
            console.log("Assigning value");
            types[type] = 1;
          }
        }
      });
    });
    return Object.keys(types).length;
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
    console.log("Animation State",this.animationState)
    switch(this.animationState){
      case ANIMATION_TYPES.FALL:
          this.state.tileDataSource.map((row, i) => {
            row.map((elem, j) => {
              Animated.spring(elem.location, {
                toValue: {
                  x: TILE_WIDTH * i,
                  y: TILE_WIDTH * j
                },
                friction: 4,
                useNativeDriver: true
              }).start();
            });
          });
      case ANIMATION_TYPES.SWAP:
          this.state.tileDataSource.map((row, i) => {
            row.map((elem, j) => {
              Animated.timing(elem.location, {
                toValue: {
                  x: TILE_WIDTH * i,
                  y: TILE_WIDTH * j
                },
                friction: 4,
                useNativeDriver: true
              }).start();
            });
          });
        default:
            this.state.tileDataSource.map((row, i) => {
              row.map((elem, j) => {
                Animated.spring(elem.location, {
                  toValue: {
                    x: TILE_WIDTH * i,
                    y: TILE_WIDTH * j
                  },
                  friction: 4,
                  useNativeDriver: true
                }).start();
              });
            });
    }

  }

  animateValuesToLocations() {
    console.log("this.animationState",this.animationState)
    switch(this.animationState){
      case ANIMATION_TYPES.FALL:
          console.log("falling")
          this.state.tileDataSource.map((row, i) => {
            row.map((elem, j) => {
              Animated.spring(elem.location, {
                toValue: {
                  x: TILE_WIDTH * i,
                  y: TILE_WIDTH * j
                },
                friction: 4,
                useNativeDriver: true
              }).start();
            });
          });
          break;
      case ANIMATION_TYPES.SWAP:
        console.log("Swapping")
          this.state.tileDataSource.map((row, i) => {
            row.map((elem, j) => {
              Animated.timing(elem.location, {
                toValue: {
                  x: TILE_WIDTH * i,
                  y: TILE_WIDTH * j
                },
                duration: 150,
                useNativeDriver: true
              }).start();
            });
          });
          break;
        default:
          console.log("Default")
            this.state.tileDataSource.map((row, i) => {
              row.map((elem, j) => {
                Animated.spring(elem.location, {
                  toValue: {
                    x: TILE_WIDTH * i,
                    y: TILE_WIDTH * j
                  },
                  friction: 4,
                  useNativeDriver: true
                }).start();
              });
            });
    }
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
              toValue: {
                x: TILE_WIDTH * i,
                y: TILE_WIDTH * j
              },
              friction: 4,
              useNativeDriver: true
            } //Step 3
          )
        ]).start(() => {});
      });
    });
  }

  // Weird name

  condenseColumns(newData) {
    let spotsToFill = 0;

    // NOTE: HARDCODED!
    for (let i = 0; i < 5; i++) {
      spotsToFill = 0;

      // Iterate through each column
      for (let j = 4; j >= 0; j--) {
        // NOTE: Wait...there's only one of this. Couldn't I use "containsIndexPair?""
        // Check to see if the element is a spot that needs filling.
        if (newData[i][j].explored == true) {
          // Increment the spots to fill...since we found a spot to fill.
          spotsToFill++;
          // Place the location above the top of the screen for when it "falls"
        } else if (spotsToFill > 0) {
          // Move bean downward
          const currentSpot = newData[i][j];
          const newSpot = newData[i][j + spotsToFill];

          newData[i][j] = newSpot;
          newData[i][j + spotsToFill] = currentSpot;
        }
      }
    }
  }

  recolorMatches(tileData) {
    tileData.map(row => {
      row.map(e => {
        if (e.explored == true) {
          //let rand = getRandomInt(this.cardCue.length);
          let newAsset = this.visualCardsWithProps.shift();
          e.assetObj = newAsset;
          e.selected = false;
          e.scale.setValue(1);
          e.explored = false;
        }
      });
    });
  }

  onTouch(indices) {
    this.animationState = ANIMATION_TYPES.FALL
    this.consecutiveSwaps = 1
    this.previousSwappedIndexes = []
    let i = indices[0];
    let j = indices[1];

    let value = this.state.tileDataSource[i][j].assetObj.value;
    let animateTo = [i * TILE_WIDTH, j * TILE_WIDTH];
    this.state.tileDataSource[i][j].explored = true;
    this.exploreAndTag(i, j);
    let numberOfTypes = this.getNumberOfTypes();
    //console.log("numberoftypes",turnInc)
    if (numberOfTypes > 2) {
      this.props.incrementTurns(1);
    } else if (numberOfTypes < 2) {
      if (!this.firstTurn) {this.props.incrementTurns(-1)};
    } 
    this.firstTurn = false

    console.log("animateTo X AND Y", animateTo);
    //this.state.tileDataSource[i][j].explored = false
    this.state.tileDataSource[i][j].assetObj = this.state.tileDataSource[i][
      j
    ].assetObj.numeral;

    this.state.tileDataSource.forEach(row => {
      row.forEach(e => {
        if (e.explored) {
          e.assetObj = e.assetObj.numeral;
        }
      });
    });


    // Call component did update
    this.setState({
      tileDataSource: this.state.tileDataSource
    });

    let quantity = 0;
    this.state.tileDataSource.forEach((row, i) => {
      row.forEach((e, j) => {
        if (e.explored == true) {
          quantity += 1;
          Animated.sequence([
            Animated.timing(e.scale, {
              toValue: 1.2,
              duration: 250,
              useNativeDriver: true
            }),
            Animated.timing(e.scale, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true
            })
          ]).start(() => {
            console.log("c.numeral", e);
            e.location.setValue({
              x: TILE_WIDTH * i,
              y: -4 * TILE_WIDTH
            });
          });
        }
      });
    });

    console.log("this.visualCardsWithProps.length",this.visualCardsWithProps.length)
    let allAreNumbers = true
    this.state.tileDataSource.forEach(row=> {
      row.forEach(e=> {
          if (e.assetObj.type != Types.NUMERAL) {
            allAreNumbers = false
          }
        }
      )})
    let endGame = allAreNumbers

    setTimeout(() => {
      this.props.popTrophy(quantity*quantity*value)
      this.props.updateScore({
        value: value,
        quantity: quantity*quantity*numberOfTypes,
        turnOver: false,
        gameOver: endGame
      });
      this.condenseColumns(this.state.tileDataSource);
      this.recolorMatches(this.state.tileDataSource);
      this.setState({
        tileDataSource: this.state.tileDataSource
      });
    }, 510);
  }



  allAreNumbers(match) {
    let areNumbers = true;
    if (match.length == 0) {
      return false;
    }
    match.map(e => {
      if (
        this.state.tileDataSource[e[0]][e[1]].assetObj.type != CardTypes.num
      ) {
        areNumbers = false;
      }
    });
    return areNumbers;
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

export default connect()(ChunksGrid)