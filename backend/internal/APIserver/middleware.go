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
		// Устанавливаем CORS заголовки
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Обрабатываем preflight запрос
		// if r.Method == "OPTIONS" {
		// 	// Для preflight запросов не выполняем перенаправления
		// 	w.WriteHeader(http.StatusOK)
		// 	return
		// }

		// Если это не preflight запрос, добавляем заголовки безопасности
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Продолжаем обработку запроса
		next.ServeHTTP(w, r)
	})
}
