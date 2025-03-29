package handler

import (
	"encoding/json"
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
	"github.com/barcek2281/AKT/backend/models"
	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MicroGreenHandler struct {
	db     *store.Store
	config *config.Config
}

func NewMicroGreenHandler(config *config.Config) *MicroGreenHandler {
	db := store.NewStore(config)

	return &MicroGreenHandler{
		db:     db,
		config: config,
	}
}

func (h *MicroGreenHandler) CreateMicroGreen(w http.ResponseWriter, r *http.Request) {
	user_id, ok := r.Context().Value("user_id").(string)
	if !ok {
		logrus.Warn("lox")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var mg models.Microgreen

	if err := json.NewDecoder(r.Body).Decode(&mg); err != nil {
		logrus.Warn("bad json file")
		http.Error(w, "Unauthorized", http.StatusBadRequest)
		return
	}

	if err := h.db.MicrogreenRepo.Add(user_id, mg); err != nil {
		http.Error(w, "bad", http.StatusBadRequest)
		logrus.Warn("cannot create model: ", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *MicroGreenHandler) GetMicroGreen(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	microgreens, err := h.db.MicrogreenRepo.GetMicrogreensByUser(userID)
	if err != nil {
		log.Warn("cannot get id")
		http.Error(w, "Failed to fetch Microgreens", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(microgreens)
}

func (h *MicroGreenHandler) UpdateMicroGreen(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var mg models.Microgreen
	if err := json.NewDecoder(r.Body).Decode(&mg); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if err := h.db.MicrogreenRepo.Update(userID, mg); err != nil {
		http.Error(w, "Failed to update Microgreen", http.StatusInternalServerError)
		logrus.Warn("cannot update model: ", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *MicroGreenHandler) DeleteMicroGreen(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		logrus.Warn("cannot delte model: ", err)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(req.ID)
	if err != nil {
		logrus.Warn("cannot make model: ", err)
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	if err := h.db.MicrogreenRepo.Delete(userID, objectID); err != nil {
		logrus.Warn("cannot delete model: ", err)
		http.Error(w, "Failed to delete Microgreen", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
