package handler

import (
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
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
	
}