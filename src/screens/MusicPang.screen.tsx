import React, {useState} from 'react'
import {StyleSheet, ImageBackground, Dimensions, Pressable, View, Text, SafeAreaView} from 'react-native'
// import SwappableGrid from '../components/SwappableGrid';
import SwappableGrid from '../components/SwappableGrid'
import Timer from '../components/ProgressTimer'

// import Images from '../lib/Images';

let playButton = require('../assets/PlayButton.png')

let justClouds = require('../assets/CloudsBackground.png')

const GameScreen = () => {
  const [moveCount, setMoveCount] = useState(0)
  const [score, setScore] = useState(0)
  return (
    <ImageBackground source={justClouds} style={styles.backGroundImage}>
      <SafeAreaView style={styles.scoreBoard}>
        <Timer setMoveCount={setMoveCount} moveCount={moveCount} score={score} />
        <View style={styles.scoreElement}>
          <Text>{score}</Text>
        </View>
        <View style={styles.scoreElement}>
          <Text>{moveCount}</Text>
        </View>
      </SafeAreaView>
      <SwappableGrid setMoveCount={setMoveCount} setScore={setScore} />
    </ImageBackground>
  )
}

let Window = Dimensions.get('window')

let windowWidth = Window.width
let windowHeight = Window.height

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBoard: {
    position: 'absolute',
    top: 0,
    flex: 3,
    flexDirection: 'row',
    width: windowWidth,
    height: windowHeight / 6,
    alignItems: 'center',
    marginTop: 15,
    // backgroundColor: red,
  },
  scoreElement: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
})

export default GameScreen
