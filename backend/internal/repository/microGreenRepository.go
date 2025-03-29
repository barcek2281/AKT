package repository

import (
	"context"
	"time"

	"github.com/barcek2281/AKT/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MicroGreenRepository struct {
	collection *mongo.Collection
}

func (m *MicroGreenRepository) Add(userID string, microgreen models.Microgreen) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	microgreen.ID = primitive.NewObjectID()
	microgreen.UserID = userObjectID

	_, err = m.collection.InsertOne(ctx, microgreen)
	if err != nil {
		return err
	}
	return nil
}

func (r *MicroGreenRepository) GetMicrogreensByUser(userID string) ([]models.Microgreen, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"user_id": objectID}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var microgreens []models.Microgreen
	if err = cursor.All(ctx, &microgreens); err != nil {
		return nil, err
	}

	return microgreens, nil
}
