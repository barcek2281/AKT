package APIserver

import (
	"os"
	"strconv"
)

type Config struct {
	BinAddr int
}

func NewConfig() *Config {
	addr := getEnv("addr", "8080")
	binAddr, _ := strconv.Atoi(addr)
	return &Config{
		BinAddr: binAddr,
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
