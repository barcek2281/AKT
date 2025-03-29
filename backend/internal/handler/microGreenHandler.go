package handler

import (
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
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var mg models.Microgreen

	if err := h.db.MicrogreenRepo.Add(user_id, mg); err != nil {
		http.Error(w, "bad", http.StatusBadRequest)
		logrus.Warn("cannot create model: ", err)
		return
	}

	w.Write([]byte("nice"))
}
