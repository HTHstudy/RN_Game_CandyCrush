import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GameScreen from '../screens/MusicPang.screen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Game" component={GameScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
