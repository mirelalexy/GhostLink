import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For the icon in the button

export default function App() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>GhostLink</Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Here, you'll eventually render your map */}
      </View>

      {/* Danger Button */}
      <TouchableOpacity style={styles.dangerButton}>
        <FontAwesome name="warning" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082', // Purple background color
    alignItems: 'center', // Center the logo horizontally
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32, // Larger font size for the logo
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 100, // Adjust this to move the logo to the top
  },
  mapContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#D3D3D3', // Light gray background as a placeholder
    borderRadius: 15, // Slight rounded corners
    marginVertical: 20,
  },
  dangerButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#FF0000', // Red background color for the button
    borderRadius: 50, // Round button
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
