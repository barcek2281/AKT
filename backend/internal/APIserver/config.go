package APIserver

import (
	"os"
	"strconv"
)

type Config struct {
	BinAddr int
	APImongoDB string
}

func NewConfig() *Config {
	addr := getEnv("addr", "8080")
	binAddr, _ := strconv.Atoi(addr)
	APImongoDB := getEnv("MONGO", "")
	return &Config{
		BinAddr: binAddr,
		APImongoDB: APImongoDB,
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
