package APIserver

import (
	"fmt"
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/handler"
)

type APIServer struct {
	mux               *http.ServeMux
	config            *config.Config
	handlerUser       *handler.UserHandler
	handlerMicroGreen *handler.MicroGreenHandler
}

func NewAPIServer(config *config.Config) *APIServer {

	return &APIServer{
		mux:               http.NewServeMux(),
		config:            config,
		handlerUser:       handler.NewUserHandler(config),
		handlerMicroGreen: handler.NewMicroGreenHandler(config),
	}
}

type contextKey string

const (
	userEmailKey contextKey = "user_email"
	userIDKey    contextKey = "user_id"
)

func (s *APIServer) Start() error {
	s.ConfigureRouter()
	return http.ListenAndServe(fmt.Sprintf(":%d", s.config.BinAddr), s.mux)
}

func (s *APIServer) ConfigureRouter() {
	s.mux.HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello"))
	})
	s.mux.Handle("POST /user/sign-up", http.HandlerFunc(s.handlerUser.SignUp))
	s.mux.Handle("POST /user/login", http.HandlerFunc(s.handlerUser.LogIn))
	s.mux.Handle("GET /user/get-info", s.middleware(http.HandlerFunc(s.handlerUser.GetInfo)))

	s.mux.Handle("POST /microgreen/create", s.middleware(http.HandlerFunc(s.handlerMicroGreen.CreateMicroGreen)))
	s.mux.HandleFunc("GET /microgreen/get", s.handlerMicroGreen.GetMicroGreen)
	s.mux.Handle("DELETE /microgreen/delete", s.middleware(http.HandlerFunc(s.handlerMicroGreen.DeleteMicroGreen)))
	s.mux.Handle("UPT /microgreen/update", s.middleware(http.HandlerFunc(s.handlerMicroGreen.UpdateMicroGreen)))

}
