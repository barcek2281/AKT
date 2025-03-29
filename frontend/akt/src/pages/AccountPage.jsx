import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: 'Gargi',
    email: 'gargi@example.com'
  });

  const [userPlants] = useState([
    {
      id: 1,
      name: "Monstera Deliciosa",
      addedDate: "15.03.2024",
      status: "Активное",
      lastWatered: "Вчера"
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      addedDate: "20.03.2024",
      status: "Активное",
      lastWatered: "2 дня назад"
    },
    {
      id: 3,
      name: "Snake Plant",
      addedDate: "25.03.2024",
      status: "Активное",
      lastWatered: "3 дня назад"
    }
  ]);

  const [userActivity] = useState({
    totalPlants: 3,
    totalScans: 5,
    lastScan: "28.03.2024",
    favoritePlant: "Monstera Deliciosa"
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
          </div>
        </div>

        <div className="user-activity-section">
          <h2>Активность пользователя</h2>
          <div className="activity-grid">
            <div className="activity-card">
              <span className="activity-value">{userActivity.totalPlants}</span>
              <span className="activity-label">Всего растений</span>
            </div>
            <div className="activity-card">
              <span className="activity-value">{userActivity.totalScans}</span>
              <span className="activity-label">Сканирований</span>
            </div>
            <div className="activity-card">
              <span className="activity-value">{userActivity.lastScan}</span>
              <span className="activity-label">Последнее сканирование</span>
            </div>
            <div className="activity-card">
              <span className="activity-value">{userActivity.favoritePlant}</span>
              <span className="activity-label">Любимое растение</span>
            </div>
          </div>
        </div>

        <div className="user-plants-section">
          <h2>Мои растения</h2>
          <div className="plants-list">
            {userPlants.map(plant => (
              <div key={plant.id} className="plant-card">
                <div className="plant-info">
                  <h3>{plant.name}</h3>
                  <div className="plant-details">
                    <span>Добавлено: {plant.addedDate}</span>
                    <span>Статус: {plant.status}</span>
                    <span>Последний полив: {plant.lastWatered}</span>
                  </div>
                </div>
                <button className="view-plant-button" onClick={() => navigate(`/details/${plant.id}`)}>
                  Подробнее
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 