import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AccountPage = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [userPlants, setUserPlants] = useState([
    { id: '1', name: 'Монстера', type: 'Комнатное', sbor: '30', addedDate: '2024-03-15', status: 'Активное', lastWatered: '2024-03-20', substrate: 'Почва', humidity: '60', atmosphere: 'Открытое пространство' },
    { id: '2', name: 'Фикус', type: 'Комнатное', sbor: '45', addedDate: '2024-03-10', status: 'Активное', lastWatered: '2024-03-19', substrate: 'Гидропоника', humidity: '55', atmosphere: 'Теплица' }
  ]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', type: '', sbor: '', addedDate: new Date().toISOString().split('T')[0], substrate: 'Почва', humidity: '', atmosphere: 'Открытое пространство' });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const storedUserEmail = await AsyncStorage.getItem('userEmail');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserInfo({
            username: parsedData.username || 'Пользователь',
            email: storedUserEmail || parsedData.email || 'Нет email'
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userData');
    router.push('/index')
  };

  const handleAddPlant = () => {
    if (newPlant.name.trim()) {
      const newPlantWithId = { ...newPlant, id: (userPlants.length + 1).toString() };
      setUserPlants([...userPlants, newPlantWithId]);
      setIsAddPlantModalOpen(false);
      setNewPlant({ name: '', type: '', sbor: '', addedDate: new Date().toISOString().split('T')[0], substrate: 'Почва', humidity: '', atmosphere: 'Открытое пространство' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Личный кабинет</Text>
        <Button title="Выйти" onPress={handleLogout} color="red" />
      </View>
      <View style={styles.plantsSection}>
        <Text style={styles.subtitle}>Мои растения</Text>
        <FlatList
          data={userPlants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.plantCard}>
              <Text style={styles.plantName}>{item.name}</Text>
              <Text>Тип: {item.type}</Text>
              <Text>Дни до сбора: {item.sbor}</Text>
              <Text>Дата посева: {item.addedDate}</Text>
              <Text>Субстрат: {item.substrate}</Text>
              <Text>Влажность: {item.humidity}%</Text>
              <Text>Атмосфера: {item.atmosphere}</Text>
            </View>
          )}
        />
        <Button style={styles.addButton} title="Добавить растение" onPress={() => setIsAddPlantModalOpen(true)} />
      </View>

      <Modal visible={isAddPlantModalOpen} animationType="slide">
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
            <TouchableOpacity style={styles.modalButtonAdd} onPress={handleAddPlant}>
              <Text style={styles.modalButtonText}>Добавить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setIsAddPlantModalOpen(false)}>
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 50
  },
  plantCard: {
    backgroundColor: "#e0e0e0",
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
  },
  plantName: {
    fontWeight: 600,
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: 'white'
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
  modalButtons: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtonAdd: {
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
  }
});

export default AccountPage;