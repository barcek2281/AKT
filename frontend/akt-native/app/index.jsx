import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { navigate } from "expo-router/build/global-state/routing";
import Details from './details';
import { useRouter } from "expo-router";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const router = useRouter();

  // const handleInputChange = (name, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const testHandle = () => {
    navigation.navigate("Details");
  }

  // const handleSubmit = async () => {
  //   const endpoint = isLogin ? "/user/login" : "/user/sign-up";
  //   try {
  //     const response = await fetch(`https://akt-win6.onrender.com${endpoint}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         email: formData.email,
  //         password: formData.password,
  //         ...(isLogin ? {} : { username: formData.username }),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Ошибка авторизации");
  //     }

  //     const data = await response.json();
  //     console.log("Успешная авторизация:", data);

  //     await AsyncStorage.setItem("userEmail", formData.email);
  //     await AsyncStorage.setItem("userData", JSON.stringify(data));

  //     // navigation.navigate("Account");
  //   } catch (error) {
  //     console.error("Ошибка:", error);
  //     Alert.alert("Ошибка", "Ошибка при входе. Проверьте данные и попробуйте снова.");
  //   }
  // };

  return (
      <View style={styles.container}>
        <Text style={styles.header}>{isLogin ? "Добро пожаловать!" : "Создать аккаунт"}</Text>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, isLogin && styles.activeTab]} onPress={() => setIsLogin(true)}>
            <Text style={styles.tabText}>Вход</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, !isLogin && styles.activeTab]} onPress={() => setIsLogin(false)}>
            <Text style={styles.tabText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Имя пользователя"
            placeholderTextColor='black'
            // value={formData.username}
            // onChangeText={(value) => handleInputChange("username", value)}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor='black'
          keyboardType="email-address"
          // value={formData.email}
          // onChangeText={(value) => handleInputChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor='black'
          secureTextEntry
          // value={formData.password}
          // onChangeText={(value) => handleInputChange("password", value)}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Подтвердите пароль"
            placeholderTextColor='black'
            secureTextEntry
            // value={formData.confirmPassword}
            // onChangeText={(value) => handleInputChange("confirmPassword", value)}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/dashboard")}> 
          <Text style={styles.buttonText}>{isLogin ? "Войти" : "Зарегистрироваться"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>{isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F3",
      padding: 20,
    },
    authContainer: {
      backgroundColor: "white",
      padding: 30,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 4, // For Android shadow
      width: "100%",
      maxWidth: 380,
    },
    authHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
      position: "relative",
    },
    backButton: {
      position: "absolute",
      left: 0,
      backgroundColor: "#F5F5F3",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      marginBottom: 30,
      color: "#1A1A1A",
      textAlign: "center",
      fontSize: 24,
      fontWeight: "600",
    },
    authSubtitle: {
      color: "#666",
      fontSize: 14,
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: 15,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 15,
      fontSize: 16,
      color: 'black',
      backgroundColor: "#F8F8F8",
      marginBottom: 15,
    },
    inputFocus: {
      borderColor: "#4CAF50",
      backgroundColor: "white",
    },
    authButton: {
      width: "100%",
      padding: 15,
      borderRadius: 15,
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 20,
    },
    authSwitch: {
      textAlign: "center",
      marginTop: 25,
    },
    buttonText: {
      fontSize: 14,
      backgroundColor: "#4CAF50",
      padding: 15,
      borderRadius: 50,
      width: 350,
      textAlign: 'center'
    },
    switchText: {
      marginTop: 10,
      color: "#666",
      fontSize: 14,
    },
    switchButton: {
      color: "#4CAF50",
      fontWeight: "600",
      fontSize: 14,
    },
    tabs: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 30,
      padding: 5,
      backgroundColor: "#F5F5F3",
      borderRadius: 15,
    },
    tab: {
      backgroundColor: '#e8e8e8',
      flex: 1,
      padding: 10,
      borderRadius: 10,
      fontWeight: "500",
    },
    tabText: {
      textAlign: 'center',
    },
    activeTab: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    inactiveTab: {
      color: "#666",
    },
  });
  

export default HomePage;
