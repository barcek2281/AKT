package config

import (
	"os"
	"strconv"
)

type Config struct {
	BinAddr    int
	APImongoDB string
	JwtKey     string
}

func NewConfig() *Config {
	addr := getEnv("addr", "8080")
	binAddr, _ := strconv.Atoi(addr)
	APImongoDB := getEnv("MONGO", "")
	jwtKey := getEnv("JWT_KEY", "")
	return &Config{
		BinAddr:    binAddr,
		APImongoDB: APImongoDB,
		JwtKey:     jwtKey,
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
