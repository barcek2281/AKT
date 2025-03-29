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
	Username string `json:"username"`
	Email  string `json:"email"`
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

        // Парсим токен
        claims := &UserClaims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            // Убедитесь, что s.config.JwtKey является []byte
            return []byte(s.config.JwtKey), nil // Конвертируем строку в []byte
        })

        if err != nil {
            log.Printf("JWT validation error: %v", err)
            http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
            return
        }

        if !token.Valid {
            http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
            return
        }

        // Добавляем claims в контекст
        ctx := context.WithValue(r.Context(), "user", claims.Username)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}