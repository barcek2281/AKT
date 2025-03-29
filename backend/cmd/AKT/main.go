package main

import (
	"log"

	"github.com/barcek2281/AKT/backend/internal/APIserver"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	prefixed "github.com/x-cray/logrus-prefixed-formatter"

	"os"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	// Initialize Logrus
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(&prefixed.TextFormatter{
		DisableColors:   false,
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
		ForceFormatting: true,
	})

	// Redirect default log package to use Logrus
	log.SetOutput(logrus.StandardLogger().Writer())
}
func main() {
	c := APIserver.NewConfig()
	s := APIserver.NewAPIServer(c)

	logrus.Info("start server on port: ", c.BinAddr)

	if err := s.Start(); err != nil {
		logrus.Warn("error to start: ", err)
	}

}
