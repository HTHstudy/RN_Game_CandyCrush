
const levelReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LEVEL": {
      console.log("ballsack")
      console.log("action",action)
      return 4
    }
    default:
      return state;
  }
};

export default levelReducer
