import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { AppRegistry, StatusBar } from "react-native";

import itemApp from "../reducers";
import Header from "../components/Header";
import ItemList from "../components/ItemList";

class HighScores extends Component {
  render() {
    return (
        <View style={styles.container}>
          <Header />
          <ItemList />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

module.exports = HighScores
