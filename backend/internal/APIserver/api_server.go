package APIserver

import (
	"fmt"
	"net/http"

	"github.com/barcek2281/AKT/backend/internal/config"
	"github.com/barcek2281/AKT/backend/internal/handler"
)

type APIServer struct {
	mux         *http.ServeMux
	config      *config.Config
	handlerUser *handler.UserHandler
}

func NewAPIServer(config *config.Config) *APIServer {

	return &APIServer{
		mux:         http.NewServeMux(),
		config:      config,
		handlerUser: handler.NewUserHandler(config),
	}
}

func (s *APIServer) Start() error {
	s.ConfigureRouter()
	return http.ListenAndServe(fmt.Sprintf(":%d", s.config.BinAddr), s.mux)
}

func (s *APIServer) ConfigureRouter() {
	s.mux.HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello"))
	})

	s.mux.HandleFunc("POST /user/sign-up", s.handlerUser.SignUp)
}
