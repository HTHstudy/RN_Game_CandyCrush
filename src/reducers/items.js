
const itemReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return [
        ...state,
        {
          name: action.name
        }
      ];
    }
    case "REMOVE_ITEM": {
      return state;
    }
    default:
      return state;
  }
};

export default itemReducer;
