// App.js

import React, { useState } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import DrawerNavigator from './navigation/DrawerNavigator';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <DrawerNavigator
        setIsDarkTheme={setIsDarkTheme}
        isDarkTheme={isDarkTheme}
      />
    </NavigationContainer>
  );
}
