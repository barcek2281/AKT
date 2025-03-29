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
      name: 'Руккола',
      type: 'Микрозелень',
      sowing_date: '2024-03-15',
      substrate: 'Кокосовый',
      harvest_days: 14,
      notes: 'Быстрый рост',
      humadity: 60,
      atmosphere: 'Sunny',
      in_house: true,
      growth_log: [
        {
          date: '2024-03-15',
          height: 0,
          notes: 'Начало выращивания',
          photoURL: ''
        },
        {
          date: '2024-03-20',
          height: 5,
          notes: 'Хороший рост',
          photoURL: ''
        }
      ]
    },
    {
      id: 2,
      name: 'Базилик',
      type: 'Микрозелень',
      sowing_date: '2024-03-10',
      substrate: 'Торфяной',
      harvest_days: 12,
      notes: 'Требует много света',
      humadity: 65,
      atmosphere: 'Sunny',
      in_house: true,
      growth_log: [
        {
          date: '2024-03-10',
          height: 0,
          notes: 'Начало выращивания',
          photoURL: ''
        },
        {
          date: '2024-03-15',
          height: 4,
          notes: 'Нормальный рост',
          photoURL: ''
        }
      ]
    }
  ]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    sowing_date: new Date().toISOString().split('T')[0],
    substrate: '',
    harvest_days: 14,
    notes: '',
    type: '',
    humadity: 60,
    atmosphere: 'Sunny',
    in_house: true,
    growth_log: []
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
    // Очищаем данные пользователя из localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    // Перенаправляем на главную страницу
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAddPlant = () => {
    if (newPlant.name.trim()) {
      const newPlantWithId = {
        ...newPlant,
        id: userPlants.length + 1,
        sowing_date: new Date(newPlant.sowing_date),
        growth_log: [{
          date: new Date(),
          height: 0,
          notes: 'Начало выращивания',
          photoURL: ''
        }]
      };
      setUserPlants([...userPlants, newPlantWithId]);
      setIsAddPlantModalOpen(false);
      setNewPlant({
        name: '',
        sowing_date: new Date().toISOString().split('T')[0],
        substrate: '',
        harvest_days: 14,
        notes: '',
        type: '',
        humadity: 60,
        atmosphere: 'Sunny',
        in_house: true,
        growth_log: []
      });
    }
  };

  const handleDeletePlant = (id) => {
    // Реализация удаления растения
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
                <p>Тип: {plant.type}</p>
                <p>Дата посева: {new Date(plant.sowing_date).toLocaleDateString()}</p>
                <p>Субстрат: {plant.substrate}</p>
                <p>Дни до сбора: {plant.harvest_days}</p>
                <p>Влажность: {plant.humadity}%</p>
                <p>Атмосфера: {plant.atmosphere}</p>
                <p>Место: {plant.in_house ? 'В помещении' : 'На улице'}</p>
                {plant.notes && <p>Заметки: {plant.notes}</p>}
                {plant.growth_log && plant.growth_log.length > 0 && (
                  <p>Последняя высота: {plant.growth_log[plant.growth_log.length - 1].height} см</p>
                )}
              </div>
              <div className="plant-actions">
                <button 
                  className="details-button"
                  onClick={() => handleNavigate(`/details/${plant.id}`)}
                >
                  Подробнее
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeletePlant(plant.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAddPlantModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить новое растение</h2>
            <div className="modal-content">
              <div className="form-grid">
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
                  <label>Тип растения</label>
                  <input
                    type="text"
                    value={newPlant.type}
                    onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
                    placeholder="Например: Микрозелень"
                  />
                </div>
                <div className="form-group">
                  <label>Дата посева</label>
                  <input
                    type="date"
                    value={newPlant.sowing_date}
                    onChange={(e) => setNewPlant({ ...newPlant, sowing_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Дни до сбора</label>
                  <input
                    type="number"
                    value={newPlant.harvest_days}
                    onChange={(e) => setNewPlant({ ...newPlant, harvest_days: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Субстрат</label>
                  <select
                    value={newPlant.substrate}
                    onChange={(e) => setNewPlant({ ...newPlant, substrate: e.target.value })}
                  >
                    <option value="">Выберите субстрат</option>
                    <option value="Кокосовый">Кокосовый</option>
                    <option value="Торфяной">Торфяной</option>
                    <option value="Гидропонный">Гидропонный</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Влажность (%)</label>
                  <input
                    type="number"
                    value={newPlant.humadity}
                    onChange={(e) => setNewPlant({ ...newPlant, humadity: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Атмосфера</label>
                  <select
                    value={newPlant.atmosphere}
                    onChange={(e) => setNewPlant({ ...newPlant, atmosphere: e.target.value })}
                  >
                    <option value="Sunny">Солнечно</option>
                    <option value="Cloudy">Пасмурно</option>
                    <option value="Rainy">Дождливо</option>
                  </select>
                </div>
                <div className="form-group checkbox-group" onClick={() => setNewPlant({ ...newPlant, in_house: !newPlant.in_house })}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newPlant.in_house}
                      onChange={(e) => setNewPlant({ ...newPlant, in_house: e.target.checked })}
                    />
                    <span>В помещении</span>
                  </label>
                </div>
                <div className="form-group full-width">
                  <label>Заметки</label>
                  <textarea
                    value={newPlant.notes}
                    onChange={(e) => setNewPlant({ ...newPlant, notes: e.target.value })}
                    placeholder="Дополнительные заметки..."
                    rows="2"
                  />
                </div>
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