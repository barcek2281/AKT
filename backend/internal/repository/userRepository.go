package repository

import (
	"context"
	"errors"
	"time"

	"github.com/barcek2281/AKT/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database, collectionName string) *UserRepository {
	return &UserRepository{
		collection: db.Collection(collectionName),
	}
}	


func (r *UserRepository) SignUp(user models.User) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Проверяем, существует ли пользователь с таким email
	existing := r.collection.FindOne(ctx, bson.M{"email": user.Email})
	if existing.Err() == nil {
		return nil, errors.New("user with this email already exists")
	}

	// Хешируем пароль перед сохранением
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	// Устанавливаем время создания (если нужно)
	// user.CreatedAt = time.Now()

	res, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	// Получаем ID созданного пользователя
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		user.ID = oid
	}

	return &user, nil
}

// LogIn аутентифицирует пользователя по email и паролю
func (r *UserRepository) LogIn(email, password string) (*models.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var user models.User
    err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, errors.New("user not found")
        }
        return nil, err
    }

    // Сравниваем хеш пароля
    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
    if err != nil {
        return nil, errors.New("invalid password")
    }

    // Очищаем пароль перед возвратом
    user.Password = ""
    return &user, nil
}

// GetByID возвращает пользователя по ID
func (r *UserRepository) GetByID(id primitive.ObjectID) (*models.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var user models.User
    err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
    if err != nil {
        return nil, err
    }

    // Не возвращаем пароль
    user.Password = ""
    return &user, nil
}

// UpdateUser обновляет данные пользователя
func (r *UserRepository) UpdateUser(id primitive.ObjectID, update models.User) (*models.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Если обновляется пароль - хешируем его
    if update.Password != "" {
        hashed, err := bcrypt.GenerateFromPassword([]byte(update.Password), bcrypt.DefaultCost)
        if err != nil {
            return nil, err
        }
        update.Password = string(hashed)
    }

    updateData := bson.M{
        "$set": bson.M{
            "name":     update.Name,
            "email":    update.Email,
            "password": update.Password,
            // добавьте другие поля, которые нужно обновлять
        },
    }

    _, err := r.collection.UpdateOne(
        ctx,
        bson.M{"_id": id},
        updateData,
    )
    if err != nil {
        return nil, err
    }

    // Возвращаем обновленного пользователя
    return r.GetByID(id)
}

// DeleteUser удаляет пользователя по ID
func (r *UserRepository) DeleteUser(id primitive.ObjectID) error {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    _, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
    return err
}

// GetAllUsers возвращает список всех пользователей (без паролей)
func (r *UserRepository) GetAllUsers() ([]models.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var users []models.User
    cursor, err := r.collection.Find(ctx, bson.M{})
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)

    for cursor.Next(ctx) {
        var user models.User
        if err := cursor.Decode(&user); err != nil {
            return nil, err
        }
        user.Password = "" // Очищаем пароль
        users = append(users, user)
    }

    if err := cursor.Err(); err != nil {
        return nil, err
    }

    return users, nil
}

// GetUserByEmail возвращает пользователя по email (без пароля)
func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var user models.User
    err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
    if err != nil {
        return nil, err
    }

    user.Password = ""
    return &user, nil
}

// ChangePassword изменяет пароль пользователя
func (r *UserRepository) ChangePassword(id primitive.ObjectID, newPassword string) error {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
    if err != nil {
        return err
    }

    _, err = r.collection.UpdateOne(
        ctx,
        bson.M{"_id": id},
        bson.M{"$set": bson.M{"password": string(hashed)}},
    )
    return err
}

// UserExists проверяет существование пользователя по email
func (r *UserRepository) UserExists(email string) (bool, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    count, err := r.collection.CountDocuments(ctx, bson.M{"email": email})
    if err != nil {
        return false, err
    }
    return count > 0, nil
}