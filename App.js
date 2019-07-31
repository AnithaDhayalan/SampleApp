import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Home from './app/screens/home';
import RestaurantDetails from './app/screens/restaurantDetails';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator({
  Home: { screen: Home },
  RestaurantDetails: { screen: RestaurantDetails },
});
const App = createAppContainer(MainNavigator);

export default App;


