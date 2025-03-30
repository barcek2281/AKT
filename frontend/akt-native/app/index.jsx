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
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const endpoint = isLogin ? "/user/login" : "/user/sign-up";
    try {
      const response = await fetch(`https://akt-win6.onrender.com${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : { name: formData.username }),
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка авторизации");
      }

      const data = await response.json();
      console.log("Успешная авторизация:", data);

      await AsyncStorage.setItem("userEmail", formData.email);
      await AsyncStorage.setItem("userData", JSON.stringify(data));

      router.push("/dashboard");
    } catch (error) {
      console.error("Ошибка:", error);
      Alert.alert("Ошибка", "Ошибка при входе. Проверьте данные и попробуйте снова.");
    }
  };

  const testHandle = () => {
    navigation.navigate("Details");
  }

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
          value={formData.username}
          onChangeText={(value) => handleInputChange("username", value)}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor='black'
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor='black'
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Подтвердите пароль"
          placeholderTextColor='black'
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
});

export default HomePage;
