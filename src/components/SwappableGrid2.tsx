import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Animated, LayoutChangeEvent} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {getRandomInt, getAllMatches, markAsMatch, condenseColumns} from '../lib/GridApi';
import {BEAN_OBJS} from '../lib/Images';
import {TileData} from '../lib/TileData';
import Tile from './Tile';

const SwappableGrid = () => {
  const [tileDataSource, setTileDataSource] = useState(initializeDataSource());
  const gridOrigin = useRef([0, 0]);

  const config = {velocityThreshold: 0.11, directionalOffsetThreshold: 50};

  useEffect(() => {
    animateValuesToLocations();
  }, [tileDataSource]);

  const animateValuesToLocations = () => {
    tileDataSource.forEach((row, i) => {
      row.forEach((elem, j) => {
        Animated.timing(elem.location, {
          toValue: {x: TILE_WIDTH * i, y: TILE_WIDTH * j},
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    gridOrigin.current = [event.nativeEvent.layout.x, event.nativeEvent.layout.y];
  };

  const renderTiles = tileData => {
    console.log('Render Tiles Called');
    const tiles = tileData.map(row => row.map(e => <Tile location={e.location} scale={e.scale} key={e.key} img={e.imgObj.image} />));

    return tiles;
  };

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

    let initialGestureX = gestureState.x0;
    let initialGestureY = gestureState.y0;

    let i = Math.round((initialGestureX - gridOrigin.current[0] - 0.5 * TILE_WIDTH) / TILE_WIDTH);
    let j = Math.round((initialGestureY - gridOrigin.current[1] - 0.5 * TILE_WIDTH) / TILE_WIDTH);

    if (i > -1 && j > -1 && i < 5 && j < 5) {
      switch (gestureName) {
        case SWIPE_UP:
          if (j > 0) swap(i, j, 0, -1);
          break;
        case SWIPE_DOWN:
          if (j < 4) swap(i, j, 0, 1);
          break;
        case SWIPE_LEFT:
          if (i > 0) swap(i, j, -1, 0);
          break;
        case SWIPE_RIGHT:
          if (i < 4) swap(i, j, 1, 0);
          break;
      }
    }
  };

  const swap = (i, j, dx, dy) => {
    const swapStarter = tileDataSource[i][j];
    const swapEnder = tileDataSource[i + dx][j + dy];

    tileDataSource[i][j] = swapEnder;
    tileDataSource[i + dx][j + dy] = swapStarter;

    const animateSwap = Animated.parallel([
      Animated.timing(swapStarter.location, {
        toValue: {x: TILE_WIDTH * (i + dx), y: TILE_WIDTH * (j + dy)},
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(swapEnder.location, {
        toValue: {x: TILE_WIDTH * i, y: TILE_WIDTH * j},
        duration: 120,
        useNativeDriver: true,
      }),
    ]);

    animateSwap.start(() => {
      let allMatches = getAllMatches(tileDataSource);
      if (allMatches.length !== 0) {
        processMatches(allMatches);
      }
    });
  };

  const processMatches = matches => {
    let nextMatches: any = [];
    console.log('실행');

    setTileDataSource(state => {
      let newTileDataSource = state.slice();
      markAsMatch(matches, newTileDataSource);
      condenseColumns(newTileDataSource);
      recolorMatches(newTileDataSource);
      nextMatches = getAllMatches(newTileDataSource);

      return newTileDataSource;
    });

    // If the matches
    if (nextMatches.length !== 0) {
      setTimeout(() => {
        processMatches(nextMatches);
      }, 250);
    }
  };

  const recolorMatches = tileData => {
    tileData.forEach(row => {
      row.forEach(e => {
        if (e.markedAsMatch === true) {
          let randIndex = getRandomInt(7);
          let randomBeanObj = BEAN_OBJS[randIndex];
          e.markedAsMatch = false;
          e.imgObj = randomBeanObj;
        }
      });
    });
  };

  return (
    <GestureRecognizer onLayout={onLayout} config={config} style={styles.gestureContainer} onSwipe={(direction, state) => onSwipe(direction, state)}>
      {renderTiles(tileDataSource)}
    </GestureRecognizer>
  );
};

const initializeDataSource = () => {
  // Grid that contains the keys that will be assigned to each tile via map
  let keys = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
  ];

  var tileData = keys.map((row, i) => {
    let dataRows = row.map((key, j) => {
      let int = getRandomInt(7);
      let randomBeanObj = BEAN_OBJS[int];
      let data = new TileData(randomBeanObj, key);
      return data;
    });
    return dataRows;
  });

  let allMatches = getAllMatches(tileData);
  console.log(allMatches);
  // 초기 배치 시 3개 일치하는 블록이 없을때 titleData 리턴
  if (!allMatches.length) {
    console.log('최종이다.');
    return tileData;
  }

  return initializeDataSource();
};

export default SwappableGrid;

let Window = Dimensions.get('window');
let windowSpan = Math.min(Window.width, Window.height);
export const TILE_WIDTH = windowSpan / 6;

let colored = false;

let blue = colored ? '#3c44d8' : undefined;
// let red = colored ? '#f24646' : undefined;
// let yellow = colored ? '#faff7f' : undefined;
let green = colored ? '#168e3a' : undefined;
// let orange = colored ? '#ea0e62' : undefined;
// let pink = colored ? '#ff51f3' : undefined;
// let white = '#ffffff';

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: blue,
  },
  gestureContainer: {
    flex: 1,
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5,
    position: 'absolute',
    backgroundColor: green,
  },
});
