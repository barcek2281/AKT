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
    { id: '1', name: 'Монстера', type: 'Декоративное', sbor: '30', addedDate: '2024-03-15', status: 'Активное', lastWatered: '2024-03-20', humidity: '60%', substrate: 'Грунт', atmosphere: 'Открытый воздух' },
    { id: '2', name: 'Фикус', type: 'Декоративное', sbor: '45', addedDate: '2024-03-10', status: 'Активное', lastWatered: '2024-03-19', humidity: '55%', substrate: 'Гидропоника', atmosphere: 'Теплица' }
  ]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: '', type: '', sowingDate: new Date(), sbor: '', humidity: '', substrate: 'Грунт', atmosphere: 'Открытый воздух' });
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    router.push('/index');
  };

  const handleAddPlant = () => {
    if (newPlant.name.trim()) {
      const newPlantWithId = { ...newPlant, id: (userPlants.length + 1).toString() };
      setUserPlants([...userPlants, newPlantWithId]);
      setIsAddPlantModalOpen(false);
      setNewPlant({ name: '', type: '', sowingDate: new Date(), sbor: '', humidity: '', substrate: 'Грунт', atmosphere: 'Открытый воздух' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Личный кабинет</Text>
        <Button title="Выйти" onPress={handleLogout} color="red" />
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.subtitle}>Профиль</Text>
        <Text>Имя пользователя: {userInfo.username}</Text>
        <Text>Email: {userInfo.email}</Text>
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
              <Text>Влажность: {item.humidity}</Text>
              <Text>Субстрат: {item.substrate}</Text>
              <Text>Атмосфера: {item.atmosphere}</Text>
            </View>
          )}
        />
        <Button title="Добавить растение" onPress={() => setIsAddPlantModalOpen(true)} />
      </View>

      <Modal visible={isAddPlantModalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.subtitle}>Добавить растение</Text>
          <TextInput placeholder="Название растения" style={styles.inputModal} value={newPlant.name} onChangeText={(text) => setNewPlant({ ...newPlant, name: text })} />
          <TextInput placeholder="Тип растения" style={styles.inputModal} value={newPlant.type} onChangeText={(text) => setNewPlant({ ...newPlant, type: text })} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>Дата посева: {newPlant.sowingDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={newPlant.sowingDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setNewPlant({ ...newPlant, sowingDate: date });
              }}
            />
          )}
          <TextInput placeholder="Дни до сбора" keyboardType="numeric" style={styles.inputModal} value={newPlant.sbor} onChangeText={(text) => setNewPlant({ ...newPlant, sbor: text })} />
          <TextInput placeholder="Влажность (%)" keyboardType="numeric" style={styles.inputModal} value={newPlant.humidity} onChangeText={(text) => setNewPlant({ ...newPlant, humidity: text })} />
          <Picker selectedValue={newPlant.substrate} onValueChange={(itemValue) => setNewPlant({ ...newPlant, substrate: itemValue })}>
            <Picker.Item label="Грунт" value="Грунт" />
            <Picker.Item label="Гидропоника" value="Гидропоника" />
          </Picker>
          <Picker selectedValue={newPlant.atmosphere} onValueChange={(itemValue) => setNewPlant({ ...newPlant, atmosphere: itemValue })}>
            <Picker.Item label="Открытый воздух" value="Открытый воздух" />
            <Picker.Item label="Теплица" value="Теплица" />
          </Picker>
          <Button title="Добавить" onPress={handleAddPlant} color="green" />
          <Button title="Отмена" onPress={() => setIsAddPlantModalOpen(false)} color="red" />
        </View>
      </Modal>
    </View>
  );
};

export default AccountPage;
