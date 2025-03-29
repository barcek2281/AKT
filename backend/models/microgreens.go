package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Microgreen struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`   // Уникальный идентификатор
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`         // Владелец партии
	Name        string             `bson:"name"`            // Название (Базилик, Редис и т.д.)
	SowingDate  time.Time          `bson:"sowing_date"`     // Дата посева
	Substrate   string             `bson:"substrate"`       // Тип субстрата (кокос, почва и пр.)
	HarvestDays int                `bson:"harvest_days"`    // Примерное время до сбора (в днях)
	Notes       string             `bson:"notes,omitempty"` // Доп. заметки
	GrowthLog   []GrowthEntry      `bson:"growth_log"`      // Записи о росе
}

// Фенологический журнал (Запись о росте)
type GrowthEntry struct {
	Date     time.Time `bson:"date"`      // Дата записи
	Height   float64   `bson:"height"`    // Высота ростков (в см)
	Notes    string    `bson:"notes"`     // Комментарии (о поливе, освещении)
	PhotoURL string    `bson:"photo_url"` // Фото URL
}
