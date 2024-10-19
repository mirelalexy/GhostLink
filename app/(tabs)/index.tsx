import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>GhostLink</Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* render map */}
      </View>

      {/* Danger Button */}
      <TouchableOpacity style={styles.dangerButton}>
      <Image
          source={require('../../assets/images/danger-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 65,
  },
  mapContainer: {
    width: 375,
    height: 375,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    marginVertical: 20,
  },
  dangerButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#9F1D1D',
    borderRadius: 10,
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
