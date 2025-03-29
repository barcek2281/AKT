import React, { useState } from "react";
import "../styles/HomePage.css";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Логика входа
      console.log("Вход:", { email: formData.email, password: formData.password });
    } else {
      // Логика регистрации
      if (formData.password !== formData.confirmPassword) {
        alert("Пароли не совпадают!");
        return;
      }
      console.log("Регистрация:", formData);
    }
  };

  return (
    <div className="home-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{isLogin ? "Вход" : "Регистрация"}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Добро пожаловать обратно!"
              : "Создайте новый аккаунт"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              className="switch-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 