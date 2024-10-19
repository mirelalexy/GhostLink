import React, { useState, useEffect } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922, 
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>GhostLink</Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Ensure mapRegion is defined before passing it to MapView */}
        {mapRegion && (
          <MapView style={styles.map} region={mapRegion}>
            {/* Pass only latitude and longitude to the Marker */}
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="Your location"
            />
          </MapView>
        )}
      </View>

      {/* Danger Button */}
      <TouchableOpacity style={styles.dangerButton}>
        <Image source={require('../../assets/images/danger-icon.png')} />
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
  map: {
    width: '100%',
    height: '100%',
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
