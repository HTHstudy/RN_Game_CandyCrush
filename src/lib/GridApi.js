export const condenseColumns = newData => {
  let spotsToFill = 0;

  // NOTE: HARDCODED!
  for (let i = 0; i < 5; i++) {
    spotsToFill = 0;

    // Iterate through each column
    for (let j = 4; j >= 0; j--) {
      // NOTE: Wait...there's only one of this. Couldn't I use "containsIndexPair?""
      // Check to see if the element is a spot that needs filling.
      if (newData[i][j].markedForUpdate == true) {
        // Increment the spots to fill...since we found a spot to fill.
        spotsToFill++;
        // Place the location above the top of the screen for when it "falls"
      } else if (spotsToFill > 0) {
        // Move bean downward
        const currentSpot = newData[i][j];
        const newSpot = newData[i][j + spotsToFill];

        newData[i][j] = newSpot;
        newData[i][j + spotsToFill] = currentSpot;
      }
    }
  }
};
