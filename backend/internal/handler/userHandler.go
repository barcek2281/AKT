package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
	"github.com/barcek2281/AKT/backend/models"
	"github.com/golang-jwt/jwt/v5"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserHandler struct {
	db     *store.Store
	config *config.Config
}

type AuthResponse struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	UserID  string `json:"user_id,omitempty"`
}

func NewUserHandler(config *config.Config) *UserHandler {
	db := store.NewStore(config)
	return &UserHandler{db: db, config: config}
}

func (u *UserHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		log.Warn(err)
		return
	}

	createdUser, err := u.db.UserRepo.SignUp(user)
	if err != nil {
		respondWithError(w, http.StatusConflict, err.Error())
		log.Warn(err)
		return
	}

	// Генерируем JWT токен
	token, err := u.generateJWT(createdUser.ID, createdUser.Email)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to generate token")
		log.Error(err)
		return
	}

	// Устанавливаем cookie с токеном
	setAuthCookie(w, token)

	respondWithJSON(w, http.StatusCreated, AuthResponse{
		Message: "User registered successfully",
		Token:   token,
		UserID:  createdUser.ID.Hex(),
	})
	log.Info("User registered: ", createdUser.Email)
}

func (u *UserHandler) LogIn(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		log.Warn(err)
		return
	}

	user, err := u.db.UserRepo.LogIn(credentials.Email, credentials.Password)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid credentials")
		log.Warn("Login failed for: ", credentials.Email)
		return
	}

	// Генерируем JWT токен
	token, err := u.generateJWT(user.ID, user.Email)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to generate token")
		log.Error(err)
		return
	}

	// Устанавливаем cookie с токеном
	setAuthCookie(w, token)

	respondWithJSON(w, http.StatusOK, AuthResponse{
		Message: "Login successful",
		Token:   token,
		UserID:  user.ID.Hex(),
	})
	log.Info("User logged in: ", user.Email)
}

func (u *UserHandler) generateJWT(userID primitive.ObjectID, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID.Hex(),
		"email":   email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Токен на 24 часа
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(u.config.JwtKey))
}

func setAuthCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Secure:   true, // В production должно быть true (HTTPS only)
		SameSite: http.SameSiteLaxMode,
	})
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}