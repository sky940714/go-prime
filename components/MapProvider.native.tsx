import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MapProvider({ shops, onMarkerPress }: any) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: 25.033, // 台北大安區中心
        longitude: 121.543,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {shops.map((shop: any) => (
        <Marker
          key={shop.id}
          coordinate={shop.coordinate}
          title={shop.name}
          onPress={() => onMarkerPress(shop)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { width: '100%', height: '100%' } });