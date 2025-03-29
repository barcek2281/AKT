package APIserver

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *APIServer) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Пропускаем публичные маршруты
		if r.URL.Path == "/api/users/signup" || r.URL.Path == "/api/users/login" {
			next.ServeHTTP(w, r)
			return
		}

		// Получаем токен из cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized: No token", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimSpace(cookie.Value)

		// Парсим токен с использованием MapClaims
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(s.config.JwtKey), nil
		})

		if err != nil || !token.Valid {
			log.Printf("JWT validation error: %v", err)
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// Извлекаем email из claims
		user_id, ok := claims["user_id"].(string)
		if !ok || user_id == "" {
			http.Error(w, "Unauthorized: Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Добавляем email в контекст
		ctx := context.WithValue(r.Context(), "user_id", user_id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *APIServer) enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests only from your frontend
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Change this to your actual frontend URL when in production

		// Allow credentials (for cookies, authorization headers)
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Allow specific HTTP methods
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Allow specific headers
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight (OPTIONS) requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

