import React, { useState, useCallback, useMemo, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Modal, StyleSheet, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardPage = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const initialDate = useMemo(() => new Date(), []);
  
  const [newPlant, setNewPlant] = useState({
    name: '',
    type: '',
    sbor: '',
    addedDate: initialDate.toISOString().split('T')[0],
    substrate: 'Почва',
    humidity: '',
    atmosphere: 'Открытое пространство',
    in_house: true
  });

  const [userPlants, setUserPlants] = useState([]);

  useEffect(() => {
    loadUserData();
    loadUserPlants();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  const loadUserPlants = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('Пользователь не авторизован');
      }
      const userData = JSON.parse(userDataStr);

      const response = await fetch('https://akt-win6.onrender.com/microgreens', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ответ сервера:', errorText);
        throw new Error('Ошибка загрузки растений');
      }
      
      const responseText = await response.text();
      console.log('Ответ сервера:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Ошибка парсинга JSON:', e);
        throw new Error('Ошибка обработки данных');
      }
      
      setUserPlants(data);
    } catch (error) {
      console.error('Ошибка загрузки растений:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось загрузить растения');
    }
  };

  const handleDateChange = useCallback((event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewPlant(prev => ({
        ...prev,
        addedDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, []);

  const handleAddPlant = useCallback(async () => {
    if (!newPlant.name.trim()) {
      Alert.alert('Ошибка', 'Введите название растения');
      return;
    }

    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('Пользователь не авторизован');
      }
      const userData = JSON.parse(userDataStr);

      const plantData = {
        name: newPlant.name,
        type: newPlant.type,
        sowing_date: new Date(newPlant.addedDate),
        substrate: newPlant.substrate,
        harvest_days: parseInt(newPlant.sbor) || 0,
        notes: newPlant.notes || '',
        humidity: parseInt(newPlant.humidity) || 0,
        atmosphere: newPlant.atmosphere,
        in_house: newPlant.in_house,
        growth_log: [{
          date: new Date(),
          height: 0,
          notes: 'Растение добавлено',
          photo_url: ''
        }]
      };

      const response = await fetch('https://akt-win6.onrender.com/microgreens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        credentials: 'include',
        body: JSON.stringify(plantData)
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        console.error('Ошибка парсинга ответа:', e);
        throw new Error('Ошибка сервера при добавлении растения');
      }

      if (!response.ok) {
        throw new Error(errorData.message || 'Ошибка добавления растения');
      }

      setUserPlants(prev => [...prev, errorData]);
      setIsAddMenuOpen(false);
      setNewPlant({
        name: '',
        type: '',
        sbor: '',
        addedDate: initialDate.toISOString().split('T')[0],
        substrate: 'Почва',
        humidity: '',
        atmosphere: 'Открытое пространство',
        in_house: true,
        notes: ''
      });
      
      Alert.alert('Успех', 'Растение успешно добавлено');
    } catch (error) {
      console.error('Ошибка добавления растения:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось добавить растение');
    }
  }, [newPlant, initialDate]);

  const toggleDatePicker = useCallback(() => {
    setShowDatePicker(prev => !prev);
  }, []);

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
          <Text style={styles.greeting}>Привет, {userData?.username || 'Пользователь'}!</Text>
          <Text style={styles.subtext}>Добро пожаловать в ваш сад</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeButton]}><Text>Indoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Outdoor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Both</Text></TouchableOpacity>
      </View>

      <View>
        <View style={styles.sectionPlants}>
          <Text style={styles.sectionTitle}>Мои растения</Text>
          <TouchableOpacity style={styles.sectionAddPlant} onPress={() => setIsAddMenuOpen(true)}>
            <Text style={styles.sectionAddText}>Добавить</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={styles.plantsScrollView}
          contentContainerStyle={styles.plantsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {userPlants.map((plant) => (
            <View key={plant.id} style={styles.plantCard}>
              <Image 
                source={{ uri: plant.growth_log?.[0]?.photo_url || "https://i.ibb.co/mzWHZLP/plant.png" }} 
                style={styles.plantImage} 
              />
              <Text style={styles.plantName}>{plant.name}</Text>
              <View style={styles.plantsDescCont}>
                <Text style={styles.plantDesc}>💧 {plant.humidity}%</Text>
                <Text style={styles.plantDesc}>🌱 {plant.type}</Text>
                <Text style={styles.plantDesc}>📅 {new Date(plant.sowing_date).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity 
                style={styles.viewDetails} 
                onPress={() => router.push({
                  pathname: '/details',
                  params: { plantId: plant.id }
                })}
              >
                <Text style={styles.viewDetailsText}>Подробнее</Text>
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
      <Modal
        visible={isAddMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddMenuOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить растение</Text>
            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={[styles.input, styles.inputField]}
                placeholder="Название растения"
                placeholderTextColor="#666"
                value={newPlant.name}
                onChangeText={(text) => setNewPlant(prev => ({ ...prev, name: text }))}
              />
              <TextInput
                style={[styles.input, styles.inputField]}
                placeholder="Тип растения"
                placeholderTextColor="#666"
                value={newPlant.type}
                onChangeText={(text) => setNewPlant(prev => ({ ...prev, type: text }))}
              />
              <TextInput 
                style={[styles.input, styles.inputField]}
                placeholder="Дни до сбора" 
                placeholderTextColor="#666"
                keyboardType="numeric" 
                value={newPlant.sbor} 
                onChangeText={(text) => setNewPlant(prev => ({ ...prev, sbor: text }))} 
              />
              <TouchableOpacity style={styles.dateButton} onPress={toggleDatePicker}>
                <Text style={styles.dateButtonText}>Дата посева: {newPlant.addedDate}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(newPlant.addedDate)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date(2020, 0, 1)}
                  maximumDate={new Date(2030, 11, 31)}
                />
              )}
              <TextInput 
                style={[styles.input, styles.inputField]}
                placeholder="Влажность (%)" 
                placeholderTextColor="#666"
                keyboardType="numeric" 
                value={newPlant.humidity} 
                onChangeText={(text) => setNewPlant(prev => ({ ...prev, humidity: text }))} 
              />
              <View style={styles.substrateContainer}>
                <Text style={styles.label}>Субстрат:</Text>
                <View style={styles.substrateButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.substrateButton, 
                      newPlant.substrate === 'Почва' && styles.substrateButtonActive
                    ]} 
                    onPress={() => setNewPlant(prev => ({ ...prev, substrate: 'Почва' }))}
                  >
                    <Text style={[
                      styles.substrateButtonText,
                      newPlant.substrate === 'Почва' && styles.substrateButtonTextActive
                    ]}>Почва</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.substrateButton, 
                      newPlant.substrate === 'Гидропоника' && styles.substrateButtonActive
                    ]} 
                    onPress={() => setNewPlant(prev => ({ ...prev, substrate: 'Гидропоника' }))}
                  >
                    <Text style={[
                      styles.substrateButtonText,
                      newPlant.substrate === 'Гидропоника' && styles.substrateButtonTextActive
                    ]}>Гидропоника</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.atmosphereContainer}>
                <Text style={styles.label}>Атмосфера:</Text>
                <View style={styles.atmosphereButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.atmosphereButton, 
                      newPlant.atmosphere === 'Открытое пространство' && styles.atmosphereButtonActive
                    ]} 
                    onPress={() => setNewPlant(prev => ({ ...prev, atmosphere: 'Открытое пространство' }))}
                  >
                    <Text style={[
                      styles.atmosphereButtonText,
                      newPlant.atmosphere === 'Открытое пространство' && styles.atmosphereButtonTextActive
                    ]}>Открытое пространство</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.atmosphereButton, 
                      newPlant.atmosphere === 'Теплица' && styles.atmosphereButtonActive
                    ]} 
                    onPress={() => setNewPlant(prev => ({ ...prev, atmosphere: 'Теплица' }))}
                  >
                    <Text style={[
                      styles.atmosphereButtonText,
                      newPlant.atmosphere === 'Теплица' && styles.atmosphereButtonTextActive
                    ]}>Теплица</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.locationContainer}>
                <Text style={styles.label}>Местоположение:</Text>
                <TouchableOpacity 
                  style={[
                    styles.locationButton,
                    newPlant.in_house && styles.locationButtonActive
                  ]}
                  onPress={() => setNewPlant(prev => ({ ...prev, in_house: !prev.in_house }))}
                >
                  <Text style={[
                    styles.locationButtonText,
                    newPlant.in_house && styles.locationButtonTextActive
                  ]}>
                    {newPlant.in_house ? 'В помещении' : 'На улице'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Дополнительные заметки"
                multiline
                numberOfLines={4}
                value={newPlant.notes}
                onChangeText={(text) => setNewPlant(prev => ({ ...prev, notes: text }))}
              />
            </ScrollView>
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
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputField: {
    height: 50,
  },
  dateButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: 'bold'
  },
  plantsScrollView: {
    flex: 1,
  },
  plantsScrollContent: {
    paddingBottom: 100,
  },
  modalScrollView: {
    maxHeight: 500,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  substrateContainer: {
    marginBottom: 15,
  },
  substrateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  substrateButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  substrateButtonActive: {
    backgroundColor: '#4CAF50',
  },
  substrateButtonText: {
    color: '#666',
  },
  substrateButtonTextActive: {
    color: 'white',
  },
  atmosphereContainer: {
    marginBottom: 15,
  },
  atmosphereButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  atmosphereButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  atmosphereButtonActive: {
    backgroundColor: '#4CAF50',
  },
  atmosphereButtonText: {
    color: '#666',
  },
  atmosphereButtonTextActive: {
    color: 'white',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  locationButtonActive: {
    backgroundColor: '#4CAF50',
  },
  locationButtonText: {
    color: '#666',
  },
  locationButtonTextActive: {
    color: 'white',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default DashboardPage;
