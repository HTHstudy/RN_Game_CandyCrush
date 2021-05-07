import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { AppRegistry, StatusBar } from "react-native";
import MyApp from "./src/containers/AppContainer";

import itemApp from "./src/reducers";
import Header from "./src/components/Header";
import ItemList from "./src/components/ItemList";


const store = createStore(itemApp, {});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MyApp />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
