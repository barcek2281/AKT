import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const DashboardPage = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', type: '', sbor: '', addedDate: new Date().toISOString().split('T')[0], substrate: 'Почва', humidity: '', atmosphere: 'Открытое пространство' });
  const [userPlants, setUserPlants] = useState([
    { id: '1', name: 'Монстера', type: 'Комнатное', sbor: '30', addedDate: '2024-03-15', status: 'Активное', lastWatered: '2024-03-20', substrate: 'Почва', humidity: '60', atmosphere: 'Открытое пространство' },
    { id: '2', name: 'Фикус', type: 'Комнатное', sbor: '45', addedDate: '2024-03-10', status: 'Активное', lastWatered: '2024-03-19', substrate: 'Гидропоника', humidity: '55', atmosphere: 'Теплица' }
  ]);
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

  const handleAddPlant = () => {
    if (newPlant.name.trim()) {
      const newPlantWithId = { ...newPlant, id: (userPlants.length + 1).toString() };
      setUserPlants([...userPlants, newPlantWithId]);
      setIsAddMenuOpen(false);
      setNewPlant({ name: '', type: '', sbor: '', addedDate: new Date().toISOString().split('T')[0], substrate: 'Почва', humidity: '', atmosphere: 'Открытое пространство' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi Gargi!</Text>
          <Text style={styles.subtext}>Good morning</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeButton]}><Text>Indoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Outdoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Both</Text></TouchableOpacity>
      </View>

      <View>
        <View style={styles.sectionPlants}>
          <Text style={styles.sectionTitle}>My Plants</Text>
          <TouchableOpacity style={styles.sectionAddPlant} onPress={() => setIsAddMenuOpen(true)}>
            <Text style={styles.sectionAddText}>Add</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {userPlants.map((userPlants) => (
            <View key={userPlants.id} style={styles.plantCard} >
              <Image source={{ uri: userPlants.image }} style={styles.plantImage} />
              <Text style={styles.plantName}>{userPlants.name}</Text>
              <View style={styles.plantsDescCont}>
                <Text style={styles.plantDesc}>💧 {userPlants.humidity} </Text>
                <Text style={styles.plantDesc}>☀️ {userPlants.light} </Text>
                <Text style={styles.plantDesc}>🌡️ {userPlants.temperature}</Text>
              </View>
              <TouchableOpacity style={styles.viewDetails} onPress={() => router.push('/details')}>
                <Text>View Details</Text> 
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <Modal visible={isMenuModalOpen} animationType="slide">
        <View style={styles.modalContainerOne}>
            <TouchableOpacity style={styles.removeModal} onPress={() => setIsMenuModalOpen(false)}>
                <Text style={styles.removeModalText}>Back</Text>
            </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isAddMenuOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.subtitle}>Добавить растение</Text>
          <TextInput placeholder="Название растения" style={styles.inputModal} value={newPlant.name} onChangeText={(text) => setNewPlant({ ...newPlant, name: text })} />
          <TextInput placeholder="Тип растения" style={styles.inputModal} value={newPlant.type} onChangeText={(text) => setNewPlant({ ...newPlant, type: text })} />
          <TextInput placeholder="Дни до сбора" keyboardType="numeric" style={styles.inputModal} value={newPlant.sbor} onChangeText={(text) => setNewPlant({ ...newPlant, sbor: text })} />
          <Text>Дата посева:</Text>
          <DateTimePicker style={styles.dateModal} value={new Date()} mode="date" display="default" onChange={(event, selectedDate) => setNewPlant({ ...newPlant, addedDate: selectedDate.toISOString().split('T')[0] })} />
          {/* <Text>Субстрат:</Text>
          {/* <Picker selectedValue={newPlant.substrate} onValueChange={(itemValue) => setNewPlant({ ...newPlant, substrate: itemValue })}>
            <Picker.Item label="Почва" value="Почва" />
            <Picker.Item label="Гидропоника" value="Гидропоника" />
          </Picker> */}
          <TextInput placeholder="Влажность (%)" keyboardType="numeric" style={styles.inputModal} value={newPlant.humidity} onChangeText={(text) => setNewPlant({ ...newPlant, humidity: text })} />
          {/* <Text>Атмосфера:</Text>
          <Picker selectedValue={newPlant.atmosphere} onValueChange={(itemValue) => setNewPlant({ ...newPlant, atmosphere: itemValue })}>
            <Picker.Item label="Открытое пространство" value="Открытое пространство" />
            <Picker.Item label="Теплица" value="Теплица" />
          </Picker> */}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonScan} onPress={() => router.push('/scanpage')}>
              <Text style={styles.modalButtonText}>Сканировать!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonAdd} onPress={handleAddPlant}>
              <Text style={styles.modalButtonText}>Добавить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setIsAddMenuOpen(false)}>
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
          
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
subtitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 50
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
viewDetails: {
  backgroundColor: "#4CAF50",
  borderRadius: 10,
  width: 300,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  height: 20
},
plantsDescCont: {
  flexDirection: 'row',
  width: 300,
  justifyContent: 'space-around'
},
  filterContainer: { 
    flexDirection: 'row',
    marginLeft: -12, 
    marginBottom: 20 
},
modalButtonScan: {
  backgroundColor: 'blue',
  width: 200,
  borderRadius: 25,
  alignItems: "center",
  padding: 10,
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
  sectionPlants: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionAddPlant: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 10 
},
  addContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  addMenuCloseBtn: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plantCard: { 
    backgroundColor: 'white', 
    padding: 10, 
    marginTop: 10,
    borderRadius: 10, 
    alignItems: 'center', 
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
    modalContainerOne: {
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
    inputModal: {
      marginTop: 20,
      borderWidth: 1,
      padding: 8,
      marginBottom: 10,
      borderRadius: 5
    },
    dateModal: {
      marginTop: 10,
    },
    removeModalText: {
      textAlign: 'center',        
    color: "black"
  },
  modalButtons: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtonAdd: {
    marginTop: 10,
    backgroundColor: 'green',
    width: 200,
    borderRadius: 25,
    alignItems: "center",
    padding: 10,
  },
  modalButtonCancel: {
    marginTop: 10,
    backgroundColor: "red",
    width: 200,
    borderRadius: 25,
    alignItems:"center",
    padding: 10
  },
  modalButtonText: {
    color: "white"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: 'white'
  },
});

export default DashboardPage;
