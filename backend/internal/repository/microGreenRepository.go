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

func NewMicroGreenRepository(db *mongo.Database, collectionName string) *MicroGreenRepository {
	return &MicroGreenRepository{
		collection: db.Collection(collectionName),
	}
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

func (r *MicroGreenRepository) Update(userID string, microgreen models.Microgreen) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": microgreen.ID, "user_id": objectID}
	update := bson.M{"$set": microgreen}

	_, err = r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *MicroGreenRepository) Delete(userID string, microgreenID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": microgreenID, "user_id": objectID}

	_, err = r.collection.DeleteOne(ctx, filter)
	return err
}
