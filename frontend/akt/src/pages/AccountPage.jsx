import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: 'Gargi',
    email: 'gargi@example.com',
    joinDate: '01.01.2024'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(userInfo);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>Мой аккаунт</h1>
        <div className="header-buttons">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>
              Редактировать
            </button>
          ) : (
            <div className="action-buttons">
              <button className="save-button" onClick={handleSave}>
                Сохранить
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      <div className="account-content">
        <div className="profile-section">
          <div className="profile-image">
            <img src="https://via.placeholder.com/150" alt="Profile" />
            {isEditing && (
              <button className="change-photo-button">
                Изменить фото
              </button>
            )}
          </div>

          <div className="user-info">
            <div className="info-group">
              <label>Имя пользователя</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editedInfo.username}
                  onChange={handleChange}
                />
              ) : (
                <p>{userInfo.username}</p>
              )}
            </div>

            <div className="info-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedInfo.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{userInfo.email}</p>
              )}
            </div>

            <div className="info-group">
              <label>Дата регистрации</label>
              <p>{userInfo.joinDate}</p>
            </div>
          </div>
        </div>

        <div className="account-stats">
          <h2>Статистика</h2>
          <div className="stats-grid">
            <div className="stat-card" onClick={() => handleNavigate('/dashboard')}>
              <span className="stat-value">12</span>
              <span className="stat-label">Растений</span>
            </div>
            <div className="stat-card" onClick={() => handleNavigate('/scan')}>
              <span className="stat-value">5</span>
              <span className="stat-label">Сканирований</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">3</span>
              <span className="stat-label">Достижений</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 