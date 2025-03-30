import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, Platform } from 'react-native';
import { Camera } from 'expo-camera';

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync();
      // Здесь можно добавить обработку фото
      console.log('Фото сделано:', photo.uri);
      Alert.alert('Успех', 'Фото успешно сделано!');
    } catch (err) {
      console.error('Ошибка при сканировании:', err);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    } finally {
      setIsScanning(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Запрос разрешения камеры...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Нет доступа к камере</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сканирование растения</Text>
      <Text style={styles.description}>Поместите растение в рамку и нажмите "Сканировать"</Text>
      
      <View style={styles.cameraContainer}>
        {isCameraOn ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
          >
            <View style={styles.scanFrame}></View>
          </Camera>
        ) : (
          <Image source={{ uri: 'https://i.ibb.co/mzWHZLP/plant.png' }} style={styles.plantPreview} />
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isCameraOn ? '#f44336' : '#4CAF50' }]} 
          onPress={() => setIsCameraOn(!isCameraOn)}
        >
          <Text style={styles.buttonText}>{isCameraOn ? 'Выключить камеру' : 'Включить камеру'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isScanning ? '#bdc3c7' : '#3498db' }]} 
          onPress={handleScan} 
          disabled={isScanning || !isCameraOn}
        >
          <Text style={styles.buttonText}>{isScanning ? 'Сканирование...' : 'Сканировать'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.backBaton}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f7fa', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: 10 
  },
  description: { 
    fontSize: 16, 
    color: '#7f8c8d', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  cameraContainer: { 
    width: 300, 
    height: 400, 
    borderRadius: 10, 
    backgroundColor: '#e8e8e8', 
    overflow: 'hidden', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  camera: { 
    width: '100%', 
    height: '100%' 
  },
  plantPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  scanFrame: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent'
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    marginTop: 10
  },
  backBaton: {
    marginTop: 20
  },
  backButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center'
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ScanPage;
