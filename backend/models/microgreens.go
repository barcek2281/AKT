package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Microgreen struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserID    primitive.ObjectID `bson:"user_id"` // Связь с пользователем
	Name      string             `bson:"name"`
	GrowthDay int                `bson:"growth_day"`
	Quantity  int                `bson:"quantity"`
}
