import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Dimensions, Animated, LayoutChangeEvent, View, Text, Easing} from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import {getRandomInt, getAllMatches, markAsMatch, condenseColumns, flattenArrayToPairs, findMoves, sleep} from '../lib/GridApi'
import {BEAN_OBJS} from '../lib/Images'
import {TileData, TileDataType} from '../lib/TileData'
import Tile from './Tile'
import {ROW, COLUMN} from '../lib/spec'

// react-native-swipe-gestures type
export enum swipeDirections {
  SWIPE_UP = 'SWIPE_UP',
  SWIPE_DOWN = 'SWIPE_DOWN',
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT',
}

interface Props {
  setMoveCount: React.Dispatch<React.SetStateAction<number>>
  setScore: React.Dispatch<React.SetStateAction<number>>
}
const SwappableGrid = ({setMoveCount, setScore}: Props) => {
  const [tileDataSource, setTileDataSource] = useState(initializeDataSource())
  const [blockScreen, setBlockScreen] = useState('')
  const gridOrigin = useRef([0, 0])
  let invalidSwap = false

  const config = {velocityThreshold: 0.3, directionalOffsetThreshold: 50}

  useEffect(() => {
    // 색깔이 변경 된 이후에 에니메이션 동작하도록 하기 위함. (기기에 따라 이미지 로딩 시간이 다름.)
    // 애니메이션 시작 시 색깔이 바뀌는 모습 노출 방지 위해 딜레이 추가.
    ;(async function () {
      await sleep(500)
      animateValuesToLocations()
      await sleep(500)
      const nextMatches = getAllMatches(tileDataSource)
      if (nextMatches.length > 0) {
        setScore(score => score + flattenArrayToPairs(nextMatches).length * 100)
        processMatches(nextMatches)
      } else {
        if (!findMoves(tileDataSource)) {
          await sleep(500)
          console.warn('더 이상 움직일 수 있는 타일이 없으므로 아무 타일이나 스왑하면 게임이 초기화 됩니다.')
        }
      }
    })()
  }, [tileDataSource])

  useEffect(() => {
    if (!!blockScreen.length) {
      setTileDataSource(initializeDataSource())
    }
  }, [blockScreen])

  const animateValuesToLocations = () => {
    tileDataSource.forEach((row, i) => {
      row.forEach((elem, j) => {
        Animated.timing(elem.location, {
          toValue: {x: TILE_WIDTH * i, y: TILE_WIDTH * j},
          duration: 500,
          useNativeDriver: true,
          // easing: Easing.inOut(Easing.elastic(1)),
        }).start(() => {
          if (!!blockScreen.length) {
            // 가끔 애니메이션 완료 이후에 이미지가 바뀌는 현상이 있는데 딜레이로 해결하는게 맞는가?
            // sleep(250).then(() => setBlockScreen(''))
            setBlockScreen('')
          }
        })
      })
    })
  }

  const onLayout = (event: LayoutChangeEvent) => {
    gridOrigin.current = [event.nativeEvent.layout.x, event.nativeEvent.layout.y]
  }

  const renderTiles = tileData => {
    const tiles = tileData.map(row => row.map(e => <Tile location={e.location} scale={e.scale} key={e.key} img={e.imgObj.image} />))

    return tiles
  }

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections

    let initialGestureX = gestureState.x0
    let initialGestureY = gestureState.y0

    let i = Math.round((initialGestureX - gridOrigin.current[0] - 0.5 * TILE_WIDTH) / TILE_WIDTH)
    let j = Math.round((initialGestureY - gridOrigin.current[1] - 0.5 * TILE_WIDTH) / TILE_WIDTH)

    if (i > -1 && j > -1 && i < ROW && j < COLUMN) {
      switch (gestureName) {
        case SWIPE_UP:
          if (j > 0) swap(i, j, 0, -1)
          break
        case SWIPE_DOWN:
          if (j < COLUMN - 1) swap(i, j, 0, 1)
          break
        case SWIPE_LEFT:
          if (i > 0) swap(i, j, -1, 0)
          break
        case SWIPE_RIGHT:
          if (i < ROW - 1) swap(i, j, 1, 0)
          break
      }
    }
  }

  const swap = (i, j, dx, dy) => {
    const swapStarter = tileDataSource[i][j]
    const swapEnder = tileDataSource[i + dx][j + dy]
    tileDataSource[i][j] = swapEnder
    tileDataSource[i + dx][j + dy] = swapStarter

    const animateSwap = Animated.parallel([
      Animated.timing(swapStarter.location, {
        toValue: {x: TILE_WIDTH * (i + dx), y: TILE_WIDTH * (j + dy)},
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(swapEnder.location, {
        toValue: {x: TILE_WIDTH * i, y: TILE_WIDTH * j},
        duration: 200,
        useNativeDriver: true,
      }),
    ])

    animateSwap.start(() => {
      let allMatches = getAllMatches(tileDataSource)

      if (allMatches.length !== 0) {
        setMoveCount(moveCount => (moveCount += 1))
        processMatches(allMatches)
        setScore(score => score + flattenArrayToPairs(allMatches).length * 100)
      } else {
        if (invalidSwap) {
          invalidSwap = false
          if (!findMoves(tileDataSource)) {
            setBlockScreen('========== 더 이상 움직일 수 있는 타일이 없습니다. ==========')
          }
          return
        }
        invalidSwap = true
        swap(i, j, dx, dy)
      }
    })
  }

  const processMatches = matches => {
    setTileDataSource(state => {
      let newTileDataSource = state.slice()
      markAsMatch(matches, newTileDataSource)
      condenseColumns(newTileDataSource)
      recolorMatches(newTileDataSource)

      return newTileDataSource
    })
  }

  const recolorMatches = tileData => {
    tileData.forEach(row => {
      row.forEach(e => {
        if (e.markedAsMatch === true) {
          let randIndex = getRandomInt(7)
          let randomBeanObj = BEAN_OBJS[randIndex]
          e.markedAsMatch = false
          e.imgObj = randomBeanObj
        }
      })
    })
  }

  return (
    <GestureRecognizer onLayout={onLayout} config={config} style={styles.gestureContainer} onSwipe={(direction, state) => onSwipe(direction, state)}>
      {renderTiles(tileDataSource)}
      {!!blockScreen.length && (
        <View style={styles.blindView}>
          <Text>{blockScreen}</Text>
        </View>
      )}
    </GestureRecognizer>
  )
}

const initializeDataSource = (): TileDataType[][] => {
  // Grid that contains the keys that will be assigned to each tile via map
  let keys = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
    [15, 16, 17],
    [18, 19, 20],
    [21, 22, 23],
    [24, 25, 26],
  ]

  var tileData = keys.map((row, i) => {
    let dataRows = row.map((key, j) => {
      let int = getRandomInt(7)
      let randomBeanObj = BEAN_OBJS[int]
      // let data = new TileData(randomBeanObj, key)
      let data = TileData(randomBeanObj, key)
      return data
    })
    return dataRows
  })

  let allMatches = getAllMatches(tileData)
  // 초기 배치 시 3개 일치하는 블록이 없고 다음 이동이 가능할 때 titleData 리턴
  if (!allMatches.length && findMoves(tileData)) return tileData

  return initializeDataSource()
}

export default React.memo(SwappableGrid)

let Window = Dimensions.get('window')
let windowSpan = Math.min(Window.width, Window.height)
export const TILE_WIDTH = windowSpan / 6

let colored = false

let blue = colored ? '#3c44d8' : undefined
// let red = colored ? '#f24646' : undefined;
// let yellow = colored ? '#faff7f' : undefined;
let green = colored ? '#168e3a' : undefined
// let orange = colored ? '#ea0e62' : undefined;
// let pink = colored ? '#ff51f3' : undefined;
// let white = '#ffffff';

let styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    width: TILE_WIDTH * ROW,
    height: TILE_WIDTH * COLUMN,
    position: 'absolute',
    backgroundColor: green,
  },
  blindView: {
    width: TILE_WIDTH * ROW,
    height: TILE_WIDTH * COLUMN,
    backgroundColor: 'white',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.5,
  },
})
