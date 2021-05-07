import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Header extends Component {
  constructor(props) {
    super(props);

    // Bind functions below
    this.handleCreateItem = this.handleCreateItem.bind(this);

  }

  handleCreateItem() {

    this.props.dispatch({
      type: "ADD_ITEM",
      name: "poop"
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left} />
          <View style={styles.middle}>
            <TouchableOpacity onPress={() => this.handleCreateItem()}>
              <Text style={styles.textRight}>ADD ITEM</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.right} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: "100%",
    backgroundColor: "#181e29"
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  left: {
    top: 40
  },
  middle: {
    top: 40
  },
  right: {
    top: 40
  },
  textRight: {
    color: "#efefef",
    fontWeight: "bold"
  }
});

export default connect()(Header);
