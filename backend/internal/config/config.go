package config

import (
	"os"
	"strconv"
)

type Config struct {
	BinAddr               int
	APImongoDB            string
	JwtKey                string
	AWS_ACCESS_KEY_ID     string
	AWS_SECRET_ACCESS_KEY string
	AWS_REGION            string
	S3_BUCKET_NAME        string
}

func NewConfig() *Config {
	addr := getEnv("addr", "8080")
	binAddr, _ := strconv.Atoi(addr)
	APImongoDB := getEnv("MONGO", "")
	jwtKey := getEnv("JWT_KEY", "")

	AWS_ACCESS_KEY_ID := getEnv("AWS_ACCESS_KEY_ID", "")
	AWS_SECRET_ACCESS_KEY := getEnv("AWS_SECRET_ACCESS_KEY", "")
	AWS_REGION := getEnv("AWS_REGION", "")
	S3_BUCKET_NAME := getEnv("S3_BUCKET_NAME", "")

	return &Config{
		BinAddr:               binAddr,
		APImongoDB:            APImongoDB,
		JwtKey:                jwtKey,
		AWS_ACCESS_KEY_ID:     AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY,
		AWS_REGION:            AWS_REGION,
		S3_BUCKET_NAME:        S3_BUCKET_NAME,
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
