import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const Details = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Plant Details</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://i.ibb.co/mzWHZLP/plant.png' }} 
          style={styles.image}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>🌿</Text>
          <Text style={styles.title}>Wild Stone Plant</Text>
        </View>
        <Text style={styles.description}>
          Plants are predominantly photosynthetic eukaryotes, forming the kingdom Plantae...
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🌱</Text>
            <Text style={styles.statLabel}>Type</Text>
            <Text style={styles.statValue}>Shrub</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💧</Text>
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>125%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>☀️</Text>
            <Text style={styles.statLabel}>Atmosphere</Text>
            <Text style={styles.statValue}>Sunny</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏠</Text>
            <Text style={styles.statLabel}>Inhouse</Text>
            <Text style={styles.statValue}>Yes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setIsModalOpen(true)}>
          <Text style={styles.buttonText}>View More</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalOpen(false)}>
              <Text style={styles.closeText}>&times;</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Wild Stone Plant - More Details</Text>
            <Text style={styles.modalDescription}>Here you can add more detailed information about the plant, its care, and other characteristics.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e8e8e8',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeText: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    textAlign: 'center',
    color: '#666',
  },
});

export default Details;