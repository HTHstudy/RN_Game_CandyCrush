import React, { Component } from "react";
import { StyleSheet, Text, View, ListView, FlatList } from "react-native";
import { connect } from "react-redux";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.handleDestroyItem = this.handleDestroyItem.bind(this);
  }

  handleDestroyItem(id) {
    this.props.dispatch({ type: "REMOVE_ITEM", id });
  }

  renderThis({item, index}) {
    return (
      <View style={styles.cell}>
        <Text> {item.name} </Text>
      </View>
    );
  }

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.items}
        renderItem={this.renderThis}
        keyExtractor={(i, index) => index.toString()}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.itemReducer,
  };
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#efefef"
  },
  cell: {
    alignItems: "center",
    padding: 5,
    borderWidth: 5,
    backgroundColor: "#4286f4"
  }
});

export default connect(mapStateToProps)(ItemList);
