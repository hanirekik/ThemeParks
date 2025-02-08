import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, LogBox,ActivityIndicator } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import LocationMarker from '../components/LocationMarker'; 
import AttractionMarker from '../components/AttractionMarker';
import InfoBar from '../components/InfoBar';
import * as Location from 'expo-location'; // ✅ Importation d'Expo Location

import RefreshButton from '../components/RefreshButton'; // ✅ Importation du bouton d'actualisation

// Ignorer l'avertissement concernant la clé unique dans une liste
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);

const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Ajout d'un état de chargement

  // Fonction pour récupérer les données du backend
  const getApiUrl = () => "http://192.168.1.17:3000/api/locations";

  const fetchWaitTimes = async () => {
    try {
      const response = await axios.get(
        'https://api.themeparks.wiki/v1/entity/e8d0207f-da8a-4048-bec8-117aa946b2c2/live'
      );
      setAttractions(response.data.liveData);
    } catch (error) {
      console.error("Erreur lors de la récupération des temps d'attente:", error);
      Alert.alert("Erreur", "Impossible de récupérer les temps d'attente.");
    }
  };

  const fetchAttractionsFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());
      console.log("get de loc de attracions")

      setAttractions((prevAttractions) => {
        return prevAttractions.map((attraction, index) => {
          const dbAttraction = response.data.find(item => item.name === attraction.name);
          return {
            ...attraction,
            latitude: dbAttraction?.latitude || attraction.latitude,
            longitude: dbAttraction?.longitude || attraction.longitude,
            uniqueKey: `${attraction.name}-${index}`,
          };
        });
      });
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des attractions depuis le backend :", error);
      Alert.alert("Erreur", "Impossible de récupérer les attractions.");
    }
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission refusée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la localisation :", error);
      setErrorMsg('Impossible de récupérer la localisation');
    }
  }


  useEffect(() => {
    const loadData = async () => {
      await fetchWaitTimes();
      console.log("recup de waittimes")
      await fetchAttractionsFromDB();
      console.log("recup de loc de attracions")
      await getUserLocation();
      console.log("recup de loc de user")
     
      setLoading(false); // ✅ Une fois toutes les données chargées, on enlève le loader
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <InfoBar selectedAttraction={selectedAttraction} />
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.872234,
          longitude: 2.775808,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {attractions.map((attraction, index) => (
          <AttractionMarker
          key={`${attraction.name}-${index}`} // ✅ Unique key définie ici
          attraction={attraction}
            onPress={setSelectedAttraction}
          />
        ))}

{location && (
          <LocationMarker location={location}           
          />
        )}

      </MapView>

      {/* ✅ Bouton pour rafraîchir les données */}
      {/* <RefreshButton onRefresh={refreshData} /> */}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default DisneylandMap;
