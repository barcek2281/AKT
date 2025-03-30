import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const DashboardPage = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const plants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    },
    {
      id: 3,
      name: "Test",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      humidity: "300%",
      light: "Sunny",
      temperature: "90"
    }
  ];

  const relatedPlants = [
    {
      id: 1,
      name: "Alberiya garden plant",
      description: "Plants are predominantly...",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      price: "25.55",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi Gargi!</Text>
          <Text style={styles.subtext}>Good morning</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuModalOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeButton]}><Text>Indoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Outdoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Both</Text></TouchableOpacity>
      </View>

      <View>
        <Text style={styles.sectionTitle}>My Plants</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {plants.map((plant) => (
            <View key={plant.id} style={styles.plantCard}>
              <Image source={{ uri: plant.image }} style={styles.plantImage} />
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text>💧 {plant.humidity} ☀️ {plant.light} 🌡️ {plant.temperature}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Related Plants</Text>
        {relatedPlants.map((plant) => (
          <View key={plant.id} style={styles.relatedPlantCard}>
            <Image source={{ uri: plant.image }} style={styles.relatedPlantImage} />
            <View style={styles.relatedPlantInfo}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text>{plant.description}</Text>
              <Text>💧 {plant.humidity} ☀️ {plant.light} 🌡️ {plant.temperature}</Text>
              <Text style={styles.price}>£{plant.price}</Text>
            </View>
          </View>
        ))}
      </View>
      <Modal visible={isMenuModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.removeModal} onPress={() => setIsMenuModalOpen(false)}>
                <Text style={styles.removeModalText}>Back</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#f5f5f5', 
    flex: 1 
},
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
},
  greeting: { 
    fontSize: 24, 
    fontWeight: 'bold' 
},
  subtext: { 
    color: '#666' 
},
  menuButton: { 
    padding: 10, 
    borderRadius: 20, 
    backgroundColor: 'white', 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5 
},
  menuIcon: { 
    fontSize: 18 
},
  filterContainer: { 
    flexDirection: 'row',
    marginLeft: -12, 
    marginBottom: 20 
},
  filterButton: { 
    padding: 10,
    marginLeft: 10, 
    borderRadius: 20, 
    backgroundColor: '#e8e8e8' 
},
  activeButton: { 
    backgroundColor: '#4CAF50', 
    color: 'white' 
},
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 10 
},
  plantCard: { 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginRight: 10 
},
  plantImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 10 
},
  plantName: { 
    fontWeight: 'bold',
    marginVertical: 5 
},
  relatedPlantCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10 
},
  relatedPlantImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 10 
},
  relatedPlantInfo: { 
    marginLeft: 10, 
    flex: 1 
},
  price: { 
    color: '#4CAF50', 
    fontWeight: 'bold', 
    marginTop: 5 
},
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    removeModal: {
        width: 100,
        height: 20,
        justifyContent:'center',
        borderRadius: 25,
        backgroundColor: 'gray'
    },  
    removeModalText: {
      textAlign: 'center',        
    color: "black"
  },
});

export default DashboardPage;
