package handler

import (
	"encoding/json"
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
	"github.com/barcek2281/AKT/backend/models"
	"github.com/sirupsen/logrus"
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

	w.Write([]byte("nice"))
}
