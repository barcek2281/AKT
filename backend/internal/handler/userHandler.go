package handler

import (
	"encoding/json"
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
	"github.com/barcek2281/AKT/backend/models"
	"github.com/sirupsen/logrus"
)

type UserHandler struct {
	db     *store.Store
	config *config.Config
}

func NewUserHandler(config *config.Config) *UserHandler {
	db := store.NewStore(config)
	return &UserHandler{db: db, config: config}
}

func (u *UserHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.Write([]byte("Ploho"))
		logrus.Warn(err)
		return
	}
	createdUser, err := u.db.UserRepo.SignUp(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		logrus.Warn(err)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "User registered successfully",
		"user_id": createdUser.ID.Hex(),
	})
}
