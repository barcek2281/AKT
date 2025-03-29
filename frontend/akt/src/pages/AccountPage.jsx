import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });
  const [userPlants, setUserPlants] = useState([
    {
      id: 1,
      name: 'Монстера',
      addedDate: '2024-03-15',
      status: 'Активное',
      lastWatered: '2024-03-20'
    },
    {
      id: 2,
      name: 'Фикус',
      addedDate: '2024-03-10',
      status: 'Активное',
      lastWatered: '2024-03-19'
    }
  ]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    addedDate: new Date().toISOString().split('T')[0],
    status: 'Активное',
    lastWatered: new Date().toISOString().split('T')[0]
  });

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserInfo({
          username: parsedData.name || 'Пользователь',
          email: userEmail || parsedData.email || 'Нет email'
        });
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        setUserInfo({
          username: 'Пользователь',
          email: userEmail || 'Нет email'
        });
      }
    } else {
      setUserInfo({
        username: 'Пользователь',
        email: userEmail || 'Нет email'
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAddPlant = () => {
    if (newPlant.name.trim()) {
      const newPlantWithId = {
        ...newPlant,
        id: userPlants.length + 1
      };
      setUserPlants([...userPlants, newPlantWithId]);
      setIsAddPlantModalOpen(false);
      setNewPlant({
        name: '',
        addedDate: new Date().toISOString().split('T')[0],
        status: 'Активное',
        lastWatered: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>Личный кабинет</h1>
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      <div className="profile-section">
        <div className="profile-info">
          <h2>Профиль</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Имя пользователя</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo.username}
                  onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                />
              ) : (
                <span>{userInfo.username}</span>
              )}
            </div>
            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              ) : (
                <span>{userInfo.email}</span>
              )}
            </div>
          </div>
          <div className="button-group">
            {isEditing ? (
              <>
                <button className="save-button" onClick={handleSave}>
                  Сохранить
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Отмена
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={handleEdit}>
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="plants-section">
        <div className="plants-header">
          <h2>Мои растения</h2>
          <button className="add-plant-button" onClick={() => setIsAddPlantModalOpen(true)}>
            +
          </button>
        </div>
        <div className="plants-grid">
          {userPlants.map((plant) => (
            <div key={plant.id} className="plant-card">
              <div className="plant-info">
                <h3>{plant.name}</h3>
                <p>Добавлено: {plant.addedDate}</p>
                <p>Статус: {plant.status}</p>
                <p>Последний полив: {plant.lastWatered}</p>
              </div>
              <button 
                className="details-button"
                onClick={() => handleNavigate(`/details/${plant.id}`)}
              >
                Подробнее
              </button>
            </div>
          ))}
        </div>
      </div>

      {isAddPlantModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить новое растение</h2>
            <div className="modal-content">
              <div className="form-group">
                <label>Название растения</label>
                <input
                  type="text"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  placeholder="Введите название"
                />
              </div>
              <div className="form-group">
                <label>Дата добавления</label>
                <input
                  type="date"
                  value={newPlant.addedDate}
                  onChange={(e) => setNewPlant({ ...newPlant, addedDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Дата последнего полива</label>
                <input
                  type="date"
                  value={newPlant.lastWatered}
                  onChange={(e) => setNewPlant({ ...newPlant, lastWatered: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="save-button" onClick={handleAddPlant}>
                Добавить
              </button>
              <button className="cancel-button" onClick={() => setIsAddPlantModalOpen(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage; 