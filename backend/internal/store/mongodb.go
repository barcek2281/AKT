package store

import (
	"context"
	"fmt"
	"time"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/repository"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

type Store struct {
	Client         *mongo.Client
	UserRepo       *repository.UserRepository
	MicrogreenRepo *repository.MicroGreenRepository

	Config *config.Config
}

func NewStore(config *config.Config) *Store {
	mongoURI := config.APImongoDB
	if mongoURI == "" {
		logrus.Fatal("MONGO environment variable not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		logrus.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	userRepo := repository.NewUserRepository(client.Database("akt"), "users")
	microRepo := repository.NewMicroGreenRepository(client.Database("akt"), "micro_green")

	return &Store{
		Client:         client,
		UserRepo:       userRepo,
		MicrogreenRepo: microRepo,
	}
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
