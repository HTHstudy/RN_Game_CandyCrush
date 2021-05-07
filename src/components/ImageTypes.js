import { getRandomInt } from "../grid-api/Methods";

export const CardTypes = {
  circ: 0,
  config: 1,
  eo: 2,
  frame: 3,
  num: 4,
  sizes: 5,
  numbershape: 6
};

// Beans
let pjb = require("../assets/PinkJellyBean.png");
let prjb = require("../assets/PurpleJellyBean.png");
let bjb = require("../assets/BlueJellyBean.png");
let ojb = require("../assets/OrangeJellyBean.png");
let gjb = require("../assets/GreenJellyBean.png");
let yjb = require("../assets/YellowJellyBean.png");
let rjb = require("../assets/RedJellyBean.png");

// Numbers that show the actual numeral
export const num_zero = require("../assets/num-zero.png");
export const num_one = require("../assets/num-one.png");
export const num_two = require("../assets/num-two.png");
export const num_three = require("../assets/num-three.png");
export const num_four = require("../assets/num-four.png");
export const num_five = require("../assets/num-five.png");
export const num_six = require("../assets/num-six.png");
export const num_seven = require("../assets/num-seven.png");
export const num_eight = require("../assets/num-eight.png");
export const num_nine = require("../assets/num-nine.png");
export const num_ten = require("../assets/num-ten.png");

let Four = require("../assets/Four.png");
let Four_2R_2Pr = require("../assets/Four_2R_2Pr.png");
let Four_3P_1B = require("../assets/Four_3P_1B.png");
let Five = require("../assets/Five.png");
let Five_4R_1G = require("../assets/Five_4R_1G.png");
let Five_3O_2B = require("../assets/Five_3O_2B.png");
let Six = require("../assets/Six.png");
let Six_3O_3B = require("../assets/Six_3O_3B.png");
let Six_5B_1G = require("../assets/Six_5B_1G.png");
let Seven_6B_1P = require("../assets/Seven_6B_1P.png");
let Seven = require("../assets/Seven.png");
let Eight = require("../assets/Eight.png");
let Eight_4P_4B = require("../assets/Eight_4P_4B.png");
let Eight_5G_3P = require("../assets/Eight_5G_3P.png");
let Eight_6B_2P = require("../assets/Eight_6B_2P.png");
let Eight_7P_1Pr = require("../assets/Eight_7P_1Pr.png");
let Nine = require("../assets/Nine.png");
let Nine_6G_3O = require("../assets/Nine_6G_3O.png");
//let Nine_6G_3O = require("../assets/Nine_6G_3O.png")
let Ten = require("../assets/Ten.png");
let Ten_6B_4G = require("../assets/Ten_6B_4G.png");
let Ten_7Pr_3G = require("../assets/Ten_7Pr_3G.png");
let Ten_8B_2R = require("../assets/Ten_8B_2R.png");
let Ten_9B_1O = require("../assets/Ten_9B_1O.png");

export const Types = {
  BLUE: 0,
  RED: 1,
  GREEN: 2,
  ORANGE: 3,
  PINK: 4,
  NUMERAL: 5,
  PURPLE: 6
};

let Zero = require("../assets/zero.png");
let Zero_B = require("../assets/Zero_B.png");
let Zero_Pi = require("../assets/Zero_Pi.png");
let Zero_P = require("../assets/Zero_P.png");
let Zero_R = require("../assets/Zero_R.png");
let Zero_G = require("../assets/Zero_G.png");
let Zero_O = require("../assets/Zero_O.png");



let One_B = require("../assets/One_B.png");
let One_O = require("../assets/One_O.png");
let One_G = require("../assets/One_G.png");
let One_Pi = require("../assets/One_Pi.png");
let One_P = require("../assets/One_P.png");
let One_R = require("../assets/One_R.png");
let Two_B = require("../assets/Two_B.png");
let Two_O = require("../assets/Two_O.png");
let Two_G = require("../assets/Two_G.png");
let Two_Pi = require("../assets/Two_Pi.png");
let Two_P = require("../assets/Two_P.png");
let Two_R = require("../assets/Two_R.png");
let Three_B = require("../assets/Three_B.png");
let Three_O = require("../assets/Three_O.png");
let Three_G = require("../assets/Three_G.png");
let Three_Pi = require("../assets/Three_Pi.png");
let Three_P = require("../assets/Three_P.png");
let Three_R = require("../assets/Three_R.png");
let Four_B = require("../assets/Four_B.png");
let Four_P = require("../assets/Four_P.png");
let Four_Pi = require("../assets/Four_Pi.png");
let Four_G = require("../assets/Four_G.png");
let Four_O = require("../assets/Four_O.png");
let Four_R = require("../assets/Four_R.png");
let Five_B = require("../assets/Five_B.png");
let Five_O = require("../assets/Five_O.png");
let Five_R = require("../assets/Five_R.png");
let Five_Pi = require("../assets/Five_Pi.png");
let Five_G = require("../assets/Five_G.png");
let Five_P = require("../assets/Five_P.png");
let Six_B = require("../assets/Six_B.png");
let Six_G = require("../assets/Six_G.png");
let Six_O = require("../assets/Six_O.png");
let Six_Pi = require("../assets/Six_Pi.png");
let Six_P = require("../assets/Six_P.png");
let Six_R = require("../assets/Six_R.png");
let Seven_G = require("../assets/Seven_G.png");
let Seven_B = require("../assets/Seven_B.png");
let Seven_P = require("../assets/Seven_P.png");
let Seven_R = require("../assets/Seven_R.png");
let Seven_O = require("../assets/Seven_O.png");
let Seven_Pi = require("../assets/Seven_Pi.png");
let Eight_B = require("../assets/Eight_B.png");
let Eight_P = require("../assets/Eight_P.png");
let Eight_Pi = require("../assets/Eight_Pi.png");
let Eight_R = require("../assets/Eight_R.png");
let Eight_G = require("../assets/Eight_G.png");
let Eight_O = require("../assets/Eight_O.png");
let Nine_B = require("../assets/Nine_B.png");
let Nine_Pi = require("../assets/Nine_Pi.png");
let Nine_P = require("../assets/Nine_P.png");
let Nine_O = require("../assets/Nine_O.png");
let Nine_R = require("../assets/Nine_R.png");
let Nine_G = require("../assets/Nine_G.png");
let Ten_B = require("../assets/Ten_B.png");
let Ten_O = require("../assets/Ten_O.png");
let Ten_Pi = require("../assets/Ten_Pi.png");
let Ten_P = require("../assets/Ten_P.png");
let Ten_R = require("../assets/Ten_R.png");
let Ten_G = require("../assets/Ten_G.png");

export const BLUE_NUMBERS = [Zero_B,
  One_B,
  Two_B,
  Three_B,
  Four_B,
  Five_B,
  Six_B,
  Seven_B,
  Eight_B,
  Nine_B,
  Ten_B
];
export const RED_NUMBERS = [Zero_R,
  One_R,
  Two_R,
  Three_R,
  Four_R,
  Five_R,
  Six_R,
  Seven_R,
  Eight_R,
  Nine_R,
  Ten_R
];
export const ORANGE_NUMBERS = [Zero_O,
  One_O,
  Two_O,
  Three_O,
  Four_O,
  Five_O,
  Six_O,
  Seven_O,
  Eight_O,
  Nine_O,
  Ten_O
];
export const PINK_NUMBERS = [Zero_Pi,
  One_Pi,
  Two_Pi,
  Three_Pi,
  Four_Pi,
  Five_Pi,
  Six_Pi,
  Seven_Pi,
  Eight_Pi,
  Nine_Pi,
  Ten_Pi
];
export const PURPLE_NUMBERS = [Zero_P,
  One_P,
  Two_P,
  Three_P,
  Four_P,
  Five_P,
  Six_P,
  Seven_P,
  Eight_P,
  Nine_P,
  Ten_P
];
export const GREEN_NUMBERS = [Zero_G,
  One_G,
  Two_G,
  Three_G,
  Four_G,
  Five_G,
  Six_G,
  Seven_G,
  Eight_G,
  Nine_G,
  Ten_G
];

export const FOUR_NUMBER_SHAPES = [
  Four_B,
  Four_P,
  Four_Pi,
  Four_R,
  Four_O,
  Four_G
];
export const FIVE_NUMBER_SHAPES = [
  Five_B,
  Five_O,
  Five_G,
  Five_P,
  Five_Pi,
  Five_R
];
export const SIX_NUMBER_SHAPES = [Six_B, Six_O, Six_G, Six_Pi, Six_P, Six_R];
export const SEVEN_NUMBER_SHAPES = [
  Seven_B,
  Seven_G,
  Seven_P,
  Seven_Pi,
  Seven_R,
  Seven_O
];
export const EIGHT_NUMBER_SHAPES = [
  Eight_B,
  Eight_P,
  Eight_Pi,
  Eight_R,
  Eight_G,
  Eight_O
];
export const NINE_NUMBER_SHAPES = [
  Nine_B,
  Nine_R,
  Nine_O,
  Nine_Pi,
  Nine_P,
  Nine_G
];
export const TEN_NUMBER_SHAPES = [Ten_R, Ten_P, Ten_Pi, Ten_O, Ten_G, Ten_B];

/*
export const FOUR_NUMBER_SHAPES = [Four,
 Four_2R_2Pr,
 Four_3P_1B,Four_2R_2Pr,
 Four_3P_1B]
 export const FIVE_NUMBER_SHAPES = [
Five ,
Five_4R_1G ,
 Five_3O_2B,
 Five_4R_1G ,
  Five_3O_2B ]
 export const SIX_NUMBER_SHAPES = [
 Six ,
 Six_3O_3B ,
 Six_5B_1G,Six_3O_3B ,
 Six_5B_1G]
 export const SEVEN_NUMBER_SHAPES = [
 Seven_6B_1P ,
 Seven,  Seven_6B_1P ,
  Seven, Seven_6B_1P]
 export const EIGHT_NUMBER_SHAPES = [
Eight,
 Eight_4P_4B,
 Eight_5G_3P ,
 Eight_6B_2P ,
 Eight_7P_1Pr ]
 export const NINE_NUMBER_SHAPES = [
 Nine ,
 Nine_6G_3O ,
  Nine ,
 Nine_6G_3O,
 Nine_6G_3O  ]
 export const TEN_NUMBER_SHAPES = [
 Ten ,
Ten_6B_4G ,
 Ten_7Pr_3G ,
Ten_8B_2R ,
Ten_9B_1O,
]
*/

class NUMBER_ZERO {
  constructor() {
    this.value = 0;
    this.img = num_zero;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_ONE {
  constructor() {
    this.value = 1;
    this.img = num_one;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_TWO {
  constructor() {
    this.value = 2;
    this.img = num_two;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_THREE {
  constructor() {
    this.value = 3;
    this.img = num_three;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_FOUR {
  constructor() {
    this.value = 4;
    this.img = num_four;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_FIVE {
  constructor() {
    this.value = 5;
    this.img = num_five;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_SIX {
  constructor() {
    this.value = 6;
    this.img = num_six;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_SEVEN {
  constructor() {
    this.value = 7;
    this.img = num_seven;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_EIGHT {
  constructor() {
    this.value = 8;
    this.img = num_eight;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_NINE {
  constructor() {
    this.value = 9;
    this.img = num_nine;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

class NUMBER_TEN {
  constructor() {
    this.value = 10;
    this.img = num_ten;
    this.type = Types.NUMERAL;
    this.numeral = this;
  }
}

let NUMBER_0 = new NUMBER_ZERO()
let NUMBER_1 = new NUMBER_ONE()
let NUMBER_2 = new NUMBER_TWO()
let NUMBER_3 = new NUMBER_THREE()
let NUMBER_4 = new NUMBER_FOUR()
let NUMBER_5 = new NUMBER_FIVE()
let NUMBER_6 = new NUMBER_SIX()
let NUMBER_7 = new NUMBER_SEVEN()
let NUMBER_8 = new NUMBER_EIGHT()
let NUMBER_9 = new NUMBER_NINE()
let NUMBER_10 = new NUMBER_TEN()

const NUMERALS = [
  NUMBER_0,
  NUMBER_1,
  NUMBER_2,
  NUMBER_3,
  NUMBER_4,
  NUMBER_5,
  NUMBER_6,
  NUMBER_7,
  NUMBER_8,
  NUMBER_9,
  NUMBER_10
];

export const initBlueNumbers = () => {
  return BLUE_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.BLUE
    };
  });
};

export const initGreenNumbers = () => {
  return GREEN_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.GREEN
    };
  });
};

export const initOrangeNumbers = () => {
  return ORANGE_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.ORANGE
    };
  });
};

export const initPinkNumbers = () => {
  return PINK_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.PINK
    };
  });
};

export const initPurpleNumbers = () => {
  return PURPLE_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.PURPLE
    };
  });
};

export const initRedNumbers = () => {
  return RED_NUMBERS.map((e, i) => {
    return {
      value: i,
      img: e,
      numeral: NUMERALS[i],
      type: Types.RED
    };
  });
};

export const initAllNumbers = () => {
  let b = initBlueNumbers();
  let p = initPurpleNumbers();
  let r = initRedNumbers();
  let o = initOrangeNumbers();
  let g = initGreenNumbers();
  let pi = initPinkNumbers();
  return [...o, ...p, ...pi, ...g, ...b, ...r];
};

export const getLevelSeqence = () => {
  let n = NUMERALS
  let sN = shuffleArray([...n, ...n, ...n, ...n, ...n, ...n,...n,...n,...n], []);
  let b = initBlueNumbers();
  let sB = shuffleArray([...b,...b, ...b, ...b, ...b], []);
  let p = initPurpleNumbers();
  let sP = shuffleArray([...p, ...p, ...p, ...p, ...p], []);
  let r = initRedNumbers();
  let sR = shuffleArray([...r, ...r, ...r, ...r, ...r], []);
  let o = initOrangeNumbers();
  let sO = shuffleArray([...o, ...o, ...o, ...o, ...o], []);
  let g = initGreenNumbers();
  let sG = shuffleArray([...g, ...g, ...g, ...g, ...g], []);
  let pi = initPinkNumbers();
  let sPi = shuffleArray([...pi, ...pi, ...pi, ...pi, ...pi], []);
  return [...sB,...sR,...sP,...sO, ...sG, ...sPi,...sN,...sN];
};

export const getNumbersWithType = type => {
  switch (type) {
    case Types.BLUE: {
      return initBlueNumbers();
    }
    case Types.PINK: {
      return initPinkNumbers();
    }
    case Types.GREEN: {
      return initGreenNumbers();
    }
    case Types.ORANGE: {
      return initOrangeNumbers();
    }
    case Types.PURPLE: {
      return initPurpleNumbers();
    }
    case Types.RED: {
      return initRedNumbers();
    }
    case Types.RED: {
      return initNumbers();
    }
    default: {
      return [];
    }
  }
};

export const shuffleNumbersWithType = type => {
  switch (type) {
    case Types.BLUE: {
      let arr = initBlueNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    case Types.PINK: {
      let arr = initPinkNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    case Types.GREEN: {
      let arr = initGreenNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    case Types.ORANGE: {
      let arr = initOrangeNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    case Types.PURPLE: {
      let arr = initPurpleNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    case Types.RED: {
      let arr = initRedNumbers();
      let shuffled = shuffleArray(arr, []);
      return shuffled;
    }
    default: {
      return [];
    }
  }
};

const initFours = () => {
  return FOUR_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 4,
      img: e,
      numeral: new NUMBER_FOUR(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initFives = () => {
  return FIVE_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 5,
      img: e,
      numeral: new NUMBER_FIVE(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initSixes = () => {
  return SIX_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 6,
      img: e,
      numeral: new NUMBER_SIX(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initSevens = () => {
  return SEVEN_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 7,
      img: e,
      numeral: new NUMBER_SEVEN(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initEights = () => {
  return EIGHT_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 8,
      img: e,
      numeral: new NUMBER_EIGHT(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initNines = () => {
  return NINE_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 9,
      img: e,
      numeral: new NUMBER_NINE(),
      type: CardTypes.numbershape
    };
    return withProps;
  });
};

const initTens = () => {
  return TEN_NUMBER_SHAPES.map((e, i) => {
    let withProps = {
      value: 10,
      img: e,
      type: CardTypes.numbershape,
      numeral: new NUMBER_TEN()
    };
    return withProps;
  });
};

// Jam
let BlueJam = require("../assets/BlueJam.png");
let RedJam = require("../assets/RedJam.png");
let GreenJam = require("../assets/GreenJam.png");
let OrangeJam = require("../assets/OrangeJam.png");
let YellowJam = require("../assets/YellowJam.png");
let PinkJam = require("../assets/PinkJam.png");
let PurpleJam = require("../assets/PurpleJam.png");
let TrophyGallery = require("../assets/TrophyGallery.png");

// Candy (Now just a rainbow bean)
let BlueCandy = require("../assets/RainbowBean.png");
let RedCandy = require("../assets/RainbowBean.png");
let GreenCandy = require("../assets/RainbowBean.png");
let OrangeCandy = require("../assets/RainbowBean.png");
let YellowCandy = require("../assets/RainbowBean.png");
let PinkCandy = require("../assets/RainbowBean.png");
let PurpleCandy = require("../assets/RainbowBean.png");

let LittleBlueTrophy = require("../assets/LittleBlueTrophy.png");
let LittleGreenTrophy = require("../assets/LittleGreenTrophy.png");
let MedBronzeTrophy = require("../assets/MedBronzeTrophy.png");
let LegendTrophy = require("../assets/LegendTrophy.png")
let BigSilverTrophy = require("../assets/BigSilverTrophy.png")
let BigGoldTrophy= require("../assets/BigGoldTrophy.png")


// Others
let floatingClouds = require("../assets/FloatingClouds.png");
let CartoonTuffy = require("../assets/TuffyTile.png");
let TopOfTuffysHead = require("../assets/TopOfTuffysHead.png");
let BackArrow = require("../assets/BackArrow.png");
let TurnIndicatorImage = require("../assets/TurnIndicatorImage.png");
let SwipeInstructions = require("../assets/SwipeInstructionalScene.png");
let BeanInstructions = require("../assets/BeanInstructionalScene.png");
let JarInstructions = require("../assets/JarInstructionalScene.png");
let RainbowInstructions = require("../assets/RainbowInstructionalScene.png");
let RainbowJam = require("../assets/RainbowJam.png");

// Numbers in a circle
export const circ_zero = require("../assets/circ-zero.png");
export const circ_one = require("../assets/circ-one.png");
export const circ_two = require("../assets/circ-two.png");
export const circ_three = require("../assets/circ-three.png");
export const circ_four = require("../assets/circ-four.png");
export const circ_five = require("../assets/circ-five.png");
export const circ_six = require("../assets/circ-six.png");
export const circ_seven = require("../assets/circ-seven.png");
export const circ_eight = require("../assets/circ-eight.png");
export const circ_nine = require("../assets/circ-nine.png");
export const circ_ten = require("../assets/circ-ten.png");

// Numbers in a frame
export const frame_zero = require("../assets/frame-zero.png");
export const frame_one = require("../assets/frame-one.png");
export const frame_two = require("../assets/frame-two.png");
export const frame_three = require("../assets/frame-three.png");
export const frame_four = require("../assets/frame-four.png");
export const frame_five = require("../assets/frame-five.png");
export const frame_six = require("../assets/frame-six.png");
export const frame_seven = require("../assets/frame-seven.png");
export const frame_eight = require("../assets/frame-eight.png");
export const frame_nine = require("../assets/frame-nine.png");
export const frame_ten = require("../assets/frame-ten.png");

// Numbers that show even and odd.
export const eo_zero = require("../assets/eo-zero.png");
export const eo_one = require("../assets/eo-one.png");
export const eo_two = require("../assets/eo-two.png");
export const eo_three = require("../assets/eo-three.png");
export const eo_four = require("../assets/eo-four.png");
export const eo_five = require("../assets/eo-five.png");
export const eo_six = require("../assets/eo-six.png");
export const eo_seven = require("../assets/eo-seven.png");
export const eo_eight = require("../assets/eo-eight.png");
export const eo_nine = require("../assets/eo-nine.png");
export const eo_ten = require("../assets/eo-ten.png");

// Numbers with different sizes.
export const sizes_zero = require("../assets/sizes-zero.png");
export const sizes_one = require("../assets/sizes-one.png");
export const sizes_two = require("../assets/sizes-two.png");
export const sizes_three = require("../assets/sizes-three.png");
export const sizes_four = require("../assets/sizes-four.png");
export const sizes_five = require("../assets/sizes-five.png");
export const sizes_six = require("../assets/sizes-six.png");
export const sizes_seven = require("../assets/sizes-seven.png");
export const sizes_eight = require("../assets/sizes-eight.png");
export const sizes_nine = require("../assets/sizes-nine.png");
export const sizes_ten = require("../assets/sizes-ten.png");

// Numbers wiht consistent configurations
export const config_zero = require("../assets/config-zero.png");
export const config_one = require("../assets/config-one.png");
export const config_two = require("../assets/config-two.png");
export const config_three = require("../assets/config-three.png");
export const config_four = require("../assets/config-four.png");
export const config_five = require("../assets/config-five.png");
export const config_six = require("../assets/config-six.png");
export const config_seven = require("../assets/config-seven.png");
export const config_eight = require("../assets/config-eight.png");
export const config_nine = require("../assets/config-nine.png");
export const config_ten = require("../assets/config-ten.png");

const SIZES_ARRAY = [
  sizes_zero,
  sizes_one,
  sizes_two,
  sizes_three,
  sizes_four,
  sizes_five,
  sizes_six,
  sizes_seven,
  sizes_eight,
  sizes_nine,
  sizes_ten
];

const CONFIG_ARRAY = [
  config_zero,
  config_one,
  config_two,
  config_three,
  config_four,
  config_five,
  config_six,
  config_seven,
  config_eight,
  config_nine,
  config_ten
];

const NUM_ARRAY = [
  num_zero,
  num_one,
  num_two,
  num_three,
  num_four,
  num_five,
  num_six,
  num_seven,
  num_eight,
  num_nine,
  num_ten
];

const EO_ARRAY = [
  eo_zero,
  eo_one,
  eo_two,
  eo_three,
  eo_four,
  eo_five,
  eo_six,
  eo_seven,
  eo_eight,
  eo_nine,
  eo_ten
];

const FRAME_ARRAY = [
  frame_zero,
  frame_one,
  frame_two,
  frame_three,
  frame_four,
  frame_five,
  frame_six,
  frame_seven,
  frame_eight,
  frame_nine,
  frame_ten
];

const CIRC_ARRAY = [
  circ_zero,
  circ_one,
  circ_two,
  circ_three,
  circ_four,
  circ_five,
  circ_six,
  circ_seven,
  circ_eight,
  circ_nine,
  circ_ten
];

export const initAllNumberShapes = () => {
  let fours = initFours();
  let fives = initFives();
  let sixes = initSixes();
  let sevens = initSevens();
  let eights = initEights();
  let nines = initNines();
  let tens = initTens();
  return [
    ...fours,
    ...fives,
    ...sixes,
    ...sevens,
    ...eights,
    ...nines,
    ...tens
  ];
};

export const filterByVal = (arr, val) => {};

export const getLevel = level => {
  console.log("level inside get level", level);
  let allShapes = initAllNumbers();
  let upperBound = 0;
  let lowerBound = 0;
  switch (level) {
    case 1: {
      upperBound = 8;
      lowerBound = 0;
      break;
    }
    case 2: {
      upperBound = 9;
      lowerBound = 1;
      break;
    }
    case 3: {
      upperBound = 10;
      lowerBound = 2;
      break;
    }
    case 4: {
      upperBound = 11;
      lowerBound = 3;
      break;
    }
    default: {
      upperBound = 10;
      lowerBound = 0;
    }
  }
  console.log("Upper bound & Lower bound", upperBound, lowerBound);
  let objects = allShapes.filter(
    e => e.value < upperBound && e.value > lowerBound
  );
  return shuffleArray(objects, []);
};

export const shuffleArray = (arr, shuffledArray) => {
  if (arr.length == 0) {
    return shuffledArray;
  }
  let index = getRandomInt(arr.length);
  shuffledArray.push(arr[index]);
  arr.splice(index, 1);
  return shuffleArray(arr, shuffledArray);
};

const initEOArrayWithProps = () => {
  return EO_ARRAY.map((e, i) => {
    let withProps = {
      numeralCard: NUM_ARRAY[i],
      value: i,
      img: e,
      type: CardTypes.eo
    };
    return withProps;
  });
};

const initConfigArrayWithProps = () => {
  return CONFIG_ARRAY.map((e, i) => {
    let withProps = {
      numeralCard: NUM_ARRAY[i],
      value: i,
      img: e,
      type: CardTypes.config
    };
    return withProps;
  });
};

const initNumArrayWithProps = () => {
  return NUM_ARRAY.map((e, i) => {
    let withProps = {
      isNumber: true,
      numeralCard: e,
      value: i,
      img: e,
      type: CardTypes.num
    };
    return withProps;
  });
};

const initCircArrayWithProps = () => {
  return CIRC_ARRAY.map((e, i) => {
    let withProps = {
      numeralCard: NUM_ARRAY[i],
      value: i,
      img: e,
      type: CardTypes.circ
    };
    return withProps;
  });
};

const initSizesArrayWithProps = () => {
  return SIZES_ARRAY.map((e, i) => {
    let withProps = {
      numeralCard: NUM_ARRAY[i],
      value: i,
      img: e,
      type: CardTypes.sizes
    };
    return withProps;
  });
};

const initFrameArrayWithProps = () => {
  return FRAME_ARRAY.map((e, i) => {
    let withProps = {
      numeralCard: NUM_ARRAY[i],
      value: i,
      img: e,
      type: CardTypes.frame
    };
    return withProps;
  });
};

export const initVisualCardsWPropsForLevel = level => {
  let config = initConfigArrayWithProps().slice(level);
  let sizes = initSizesArrayWithProps().slice(level);
  let frame = initFrameArrayWithProps().slice(level);
  let circ = initCircArrayWithProps().slice(level);
  let eo = initEOArrayWithProps().slice(level);
  return [...config, ...sizes, ...frame, ...circ, ...eo];
};

export const initNumCardsWPropsForLevel = level => {
  return initNumArrayWithProps().slice(level);
};

export const CIRC_ARRAY_PROPS = initCircArrayWithProps();
export const CONFIG_ARRAY_PROPS = initConfigArrayWithProps();
export const NUM_ARRAY_PROPS = initNumArrayWithProps();
export const SIZES_ARRAY_PROPS = initSizesArrayWithProps();
export const EO_ARRAY_PROPS = initEOArrayWithProps();
export const FRAME_ARRAY_PROPS = initFrameArrayWithProps();


export const getObjectsForCardType = (objects, type) => {
  console.log("objects", objects);
  return objects.filter(obj => obj.type == type);
};

export const VISUAL_ARRAYS_PROPS = [
  ...CONFIG_ARRAY_PROPS,
  ...SIZES_ARRAY_PROPS,
  ...EO_ARRAY_PROPS,
  ...FRAME_ARRAY_PROPS
];

export const ImageTypes = {
  BIG_GOLD_TROPHY: BigGoldTrophy,
  LITTLE_BLUE_TROPHY: LittleBlueTrophy,
  LITTLE_GREEN_TROPHY: LittleGreenTrophy,
  MED_BRONZE_TROPHY: MedBronzeTrophy,
  LEGEND_TROPHY: LegendTrophy,
  BIG_SILVER_TROPHY: BigSilverTrophy,
  PINKJELLYBEAN: pjb,
  PURPLEJELLYBEAN: prjb,
  BLUEJELLYBEAN: bjb,
  REDJELLYBEAN: rjb,
  YELLOWJELLYBEAN: yjb,
  ORANGEJELLYBEAN: ojb,
  GREENJELLYBEAN: gjb,
  REDJAM: num_three,
  BLUEJAM: num_four,
  GREENJAM: num_five,
  PURPLEJAM: num_six,
  PINKJAM: num_seven,
  ORANGEJAM: num_eight,
  YELLOWJAM: num_nine,
  REDCANDY: RedCandy,
  BLUECANDY: BlueCandy,
  GREENCANDY: GreenCandy,
  PURPLECANDY: PurpleCandy,
  PINKCANDY: PinkCandy,
  ORANGECANDY: OrangeCandy,
  YELLOWCANDY: YellowCandy,
  CARTOONTUFFY: CartoonTuffy,
  TOPOFTUFFYSHEAD: TopOfTuffysHead,
  BACKARROW: BackArrow,
  TURNINDICATORIMAGE: TurnIndicatorImage,
  SWIPEINSTRUCTIONS: SwipeInstructions,
  BEANINSTRUCTIONS: BeanInstructions,
  JARINSTRUCTIONS: JarInstructions,
  RAINBOWINSTRUCTIONS: RainbowInstructions,
  RAINBOWJAM: RainbowJam,
  TROPHY_GALLERY: TrophyGallery
};
