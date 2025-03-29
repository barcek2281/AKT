import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сканирование растения</Text>
      <Text style={styles.description}>Поместите растение в рамку и нажмите "Сканировать"</Text>
      
      <View style={styles.cameraContainer}>
        {isCameraOn ? (
          <RNCamera
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
        ) : (
          <Image source={{ uri: 'https://i.ibb.co/mzWHZLP/plant.png' }} style={styles.plantPreview} />
        )}
        <View style={styles.scanFrame}></View>
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
    width: 250, 
    height: 250, 
    resizeMode: 'contain' 
},
  scanFrame: { 
    position: 'absolute', 
    width: 250, 
    height: 250, 
    borderWidth: 2, 
    borderColor: '#3498db', 
    borderRadius: 10 
},
  buttonContainer: { 
    flexDirection: 'row', 
    marginTop: 20, 
    gap: 10 
},
  button: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    minWidth: 140 
},
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
},
  error: { 
    color: '#f44336', 
    marginTop: 10 
},
});

export default ScanPage;
