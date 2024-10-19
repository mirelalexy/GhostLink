import React, { useState, useEffect } from 'react';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825, // Default location
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tilePath, setTilePath] = useState<string | null>(null); // Store the path to offline tiles
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current position of the user
      let { coords } = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Set the path to the offline map tiles (stored in the "tiles" folder)
      const tileDir = `${FileSystem.documentDirectory}tiles/`;
      setTilePath(tileDir);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>GhostLink</Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {tilePath ? (
          <MapView style={styles.map} region={mapRegion}>
            {/* Use UrlTile to load local tiles */}
            <UrlTile
              urlTemplate={`${tilePath}/{z}/{x}/{y}.png`} // Template for local tile structure
              maximumZ={19} // Adjust this value as per your downloaded tile zoom levels
              flipY={false} // Most tile services use non-flipped Y coordinates
            />
            {/* Marker showing user's current location */}
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="Your location"
            />
          </MapView>
        ) : (
          <Text>Loading map...</Text>
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
