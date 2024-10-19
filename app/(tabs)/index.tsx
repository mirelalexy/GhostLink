import React, { useState, useEffect } from 'react';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825, // default location
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tilePath, setTilePath] = useState<string | null>(null); // path to offline tiles
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]); // device locations (markers)
  const [visibleDevices, setVisibleDevices] = useState<any[]>([]); // marker animation
  const [polylines, setPolylines] = useState<any[]>([]); // danger lines

  useEffect(() => {
    (async () => {
      // request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // get current position of the user
      let { coords } = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // set the path to the offline map tiles (stored in the "tiles" folder)
      const tileDir = `${FileSystem.documentDirectory}tiles/`;
      setTilePath(tileDir);
    })();
  }, []);

  // function to generate test bluetooth device locations 
  const checkForDevices = () => {
    const newDevices = [
      { latitude: mapRegion.latitude + 0.001, longitude: mapRegion.longitude + 0.001 },
      { latitude: mapRegion.latitude - 0.001, longitude: mapRegion.longitude - 0.001 },
      { latitude: mapRegion.latitude + 0.002, longitude: mapRegion.longitude - 0.002 },
    ];

    setVisibleDevices([]);

    //slow reappearance
    newDevices.forEach((device, index) => {
      setTimeout(() => {
        setVisibleDevices((prevVisibleDevices) => [...prevVisibleDevices, device]);
      }, index * 500); // 500ms delay between each marker appearing
    });
  };

  // trigger danger lines to blue markers
  const triggerDangerAlert = () => {
    const intervalTime = 50; 
    const animationDuration = 2000; // animation duration (2 seconds)
    const steps = animationDuration / intervalTime; // number of steps
  
    const newPolylines = visibleDevices.map((device) => {
      const startLat = mapRegion.latitude;
      const startLng = mapRegion.longitude;
      const endLat = device.latitude;
      const endLng = device.longitude;
  
      // danger lines that will gradually grow
      return {
        coordinates: [{ latitude: startLat, longitude: startLng }],
        color: 'red',
      };
    });
  
    setPolylines(newPolylines); // set the initial lines
  
    visibleDevices.forEach((device, deviceIndex) => {
      let currentStep = 0;
  
      const intervalId = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(intervalId); // stop the interval when animation is complete
        } else {
          currentStep++;
  
          // calculate the next point on the polyline
          const startLat = mapRegion.latitude;
          const startLng = mapRegion.longitude;
          const endLat = device.latitude;
          const endLng = device.longitude;
  
          const lat = startLat + ((endLat - startLat) / steps) * currentStep;
          const lng = startLng + ((endLng - startLng) / steps) * currentStep;
  
          // avoid updating the lines if they've been cleared
          setPolylines((prevPolylines) => {
            const updatedPolylines = [...prevPolylines];
            if (updatedPolylines[deviceIndex]) {  // check if lines still exists
              const updatedCoordinates = [
                ...updatedPolylines[deviceIndex].coordinates,
                { latitude: lat, longitude: lng },
              ];
              updatedPolylines[deviceIndex] = {
                ...updatedPolylines[deviceIndex],
                coordinates: updatedCoordinates,
              };
            }
            return updatedPolylines;
          });
        }
      }, intervalTime);
    });
  
    // remove the lines after 2 seconds
    setTimeout(() => {
      setPolylines([]); // clear the lines after 2 seconds
    }, animationDuration);
  };
  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logoText}>GhostLink</Text>

      {/* Map Container*/}
      <View style={styles.mapWrapper}>
        <MapView style={styles.map} region={mapRegion}>
          {/* use UrlTile to load local tiles */}
          <UrlTile
            urlTemplate={`${tilePath}/{z}/{x}/{y}.png`} // template for local tile structure
            maximumZ={15} // tile zoom levels
            flipY={false} // non-flipped Y coordinates
          />
          {/* current location */}
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title="Your location"
          />
          {/* device markers that reappear slowly */}
          {visibleDevices.map((device, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: device.latitude,
                longitude: device.longitude,
              }}
              pinColor="blue" // blue markers for devices
              title={`Device ${index + 1}`}
            />
          ))}

          {/* render the danger lines */}
          {polylines.map((polyline, index) => (
            <Polyline
              key={index}
              coordinates={polyline.coordinates}
              strokeColor={polyline.color}
              strokeWidth={3} 
            />
          ))}
        </MapView>
      </View>

      {/* Danger Button */}
      <TouchableOpacity style={styles.dangerButton} onPress={triggerDangerAlert}>
        <Image source={require('../../assets/images/danger-icon.png')} />
      </TouchableOpacity>

      {/* Check for Devices Button */}
      <TouchableOpacity style={styles.deviceButton} onPress={checkForDevices}>
        <Text style={styles.buttonText}>Check for Devices</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1352',
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
  mapWrapper: {
    width: 375,
    height: 375,
    backgroundColor: '#D3D3D3',
    borderRadius: 20, 
    overflow: 'hidden', // ensures the MapView respects the borderRadius
    borderColor: 'white', 
    borderWidth: 4, 
  },
  map: {
    width: '100%',
    height: '100%',
  },
  dangerButton: {
    position: 'absolute',
    bottom: 110, 
    width: 375, 
    height: 65,
    backgroundColor: '#9F1D1D',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  deviceButton: {
    position: 'absolute',
    bottom: 40, 
    width: 375, 
    height: 65,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
