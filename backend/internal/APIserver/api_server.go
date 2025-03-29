package APIserver

import (
	"fmt"
	"net/http"
)

type APIServer struct {
	mux *http.ServeMux
	config *Config
}

func NewAPIServer(config *Config) *APIServer {
	return &APIServer{
		mux: http.NewServeMux(),
		config: config,
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
}

