package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Microgreen struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`          // Уникальный идентификатор
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`           // Владелец партии
	Name        string             `bson:"name" json:"name"`                 // Название (Базилик, Редис и т.д.)
	SowingDate  time.Time          `bson:"sowing_date" json:"sowing_date"`   // Дата посева
	Substrate   string             `bson:"substrate" json:"substrate"`       // Тип субстрата (кокос, почва и пр.)
	HarvestDays int                `bson:"harvest_days" json:"harvest_days"` // Примерное время до сбора (в днях)
	Notes       string             `bson:"notes,omitempty" json:"notes"`     // Доп. заметки
	Type        string             `bson:"type,omitempty" json:"type"`
	Humadity    int                `bson:"humadity,omitempty" json:"humadity"`
	Atmosphere  string             `bson:"atmosphere,omitempty" json:"atmosphere"`
	InHouse     bool               `bson:"in_house,omitempty" json:"in_house"`
	GrowthLog   []GrowthEntry      `bson:"growth_log" json:"growth_log"` // Записи о росе
}

// Фенологический журнал (Запись о росте)
type GrowthEntry struct {
	Date     time.Time `bson:"date" json:"date"`          // Дата записи
	Height   float64   `bson:"height" json:"height"`      // Высота ростков (в см)
	Notes    string    `bson:"notes" json:"notes"`        // Комментарии (о поливе, освещении)
	PhotoURL string    `bson:"photo_url" json:"photoURL"` // Фото URL
}
