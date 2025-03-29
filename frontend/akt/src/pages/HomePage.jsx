import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
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
      // После успешного входа перенаправляем на страницу сканирования
      navigate("/scan");
    } else {
      // Логика регистрации
      if (formData.password !== formData.confirmPassword) {
        alert("Пароли не совпадают!");
        return;
      }
      console.log("Регистрация:", formData);
      // После успешной регистрации перенаправляем на страницу входа
      setIsLogin(true);
    }
  };

  return (
    <div className="home-page">
      <div className="auth-container">
        <div className="auth-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>{isLogin ? "Добро пожаловать!" : "Создать аккаунт"}</h1>
        </div>

        <div className="tabs">
          <div
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </div>
          <div
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Введите имя пользователя"
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
              placeholder="Введите email"
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
              placeholder="Введите пароль"
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
                placeholder="Подтвердите пароль"
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
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
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