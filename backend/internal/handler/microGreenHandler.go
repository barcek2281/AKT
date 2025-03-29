package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/store"
	"github.com/barcek2281/AKT/backend/models"
	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MicroGreenHandler struct {
	db     *store.Store
	s3     *store.S3AWS
	config *config.Config
}

func NewMicroGreenHandler(config *config.Config) *MicroGreenHandler {
	db := store.NewStore(config)
	s3, err := store.NewS3AWS(config)
	if err != nil {
		log.Fatal("lox")
	}
	return &MicroGreenHandler{
		db:     db,
		s3:     s3,
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
func (h *MicroGreenHandler) AppendMicroGreenLog(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		logrus.Warn("Unauthorized access")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	microgreenID := r.FormValue("microgreen_id")
	heightStr := r.FormValue("height")
	notes := r.FormValue("notes")

	if microgreenID == "" || heightStr == "" {
		logrus.Warn("Missing required fields")
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(microgreenID)
	if err != nil {
		logrus.Warn("Invalid microgreen ID format", err)
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	height, err := strconv.ParseFloat(heightStr, 64)
	if err != nil {
		logrus.Warn("Invalid height format", err)
		http.Error(w, "Invalid height format", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		logrus.Warn("Failed to read file", err)
		http.Error(w, "Failed to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	modelsGAYS, err := h.db.MicrogreenRepo.GetMicrogreensByUser(userID)
	var res models.Microgreen

	for _, m := range modelsGAYS {
		if m.ID == objectID {
			res = m
		}
	}

	newFilename := strings.Join([]string{userID, microgreenID, strconv.Itoa(len(res.GrowthLog)+1)}, "/")
	fileURL, err := h.s3.UploadImage(file, newFilename)
	if err != nil {
		logrus.Warn("Failed to upload image", err)
		http.Error(w, "Failed to upload image", http.StatusInternalServerError)
		return
	}

	logEntry := models.GrowthEntry{
		Date:     time.Now(),
		Height:   height,
		Notes:    notes,
		PhotoURL: fileURL,
	}

	res.GrowthLog = append(res.GrowthLog, logEntry)

	if err := h.db.MicrogreenRepo.Update(userID, res); err != nil {
		logrus.Warn("Failed to update growth log", err)
		http.Error(w, "Failed to update growth log", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Growth log updated successfully", "photo_url": fileURL})
}

func (h *MicroGreenHandler) DownloadMicroGreen(w http.ResponseWriter, r *http.Request) {
	fileName := r.URL.Query().Get("filename")
	if fileName == "" {
		http.Error(w, "Filename is required", http.StatusBadRequest)
		return
	}

	fileURL, err := h.s3.DownloadImage(fileName)
	if err != nil {
		http.Error(w, "Failed to generate download URL", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fileURL))
}
