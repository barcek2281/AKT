package store

import (
	"context"
	"fmt"
	"time"

	"github.com/barcek2281/AKT/backend/internal/APIserver"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

type Store struct {
	Client *mongo.Client
	Config *APIserver.Config
}

func (s *Store) ConnectMongoDB() {
	mongoURI := s.Config.APImongoDB
	if mongoURI == "" {
		logrus.Fatal("MONGO environment variable not set")
	}

	// Создаем контекст с таймаутом
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Подключаемся к MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		logrus.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Проверяем подключение
	err = client.Ping(ctx, nil)
	if err != nil {
		logrus.Fatalf("Failed to ping MongoDB: %v", err)
	}

	fmt.Println("Successfully connected to MongoDB!")

	// Пример: получаем коллекцию
	collection := client.Database("akt").Collection("users")
	fmt.Println("Collection reference:", collection.Name())

	// Не забываем закрыть соединение при завершении
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			logrus.Printf("Failed to disconnect from MongoDB: %v", err)
		}
	}()
}