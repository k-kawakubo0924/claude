package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"taskmanager/internal/models"
)

var DB *gorm.DB

func Connect() {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	name := getEnv("DB_NAME", "taskmanager")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=UTC",
		host, port, user, password, name,
	)

	var err error
	var conn *gorm.DB
	maxRetries := 15
	for i := 1; i <= maxRetries; i++ {
		conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("db connection attempt %d/%d failed: %v", i, maxRetries, err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		log.Fatalf("could not connect to database after %d attempts: %v", maxRetries, err)
	}

	if err := conn.AutoMigrate(&models.Task{}); err != nil {
		log.Fatalf("auto migration failed: %v", err)
	}

	DB = conn
	log.Println("database connected and migrated")

	seedIfEmpty()
}

func seedIfEmpty() {
	var count int64
	DB.Model(&models.Task{}).Count(&count)
	if count > 0 {
		return
	}

	seed := []models.Task{
		{Title: "公園でジョギングする", Description: "近所の公園を30分走る", Status: models.StatusTodo, Priority: models.PriorityMedium, Category: models.CategoryOutdoor},
		{Title: "洗車をする", Description: "週末に車を洗う", Status: models.StatusTodo, Priority: models.PriorityLow, Category: models.CategoryOutdoor},
		{Title: "読書をする", Description: "積んでいる本を1章読む", Status: models.StatusTodo, Priority: models.PriorityLow, Category: models.CategoryIndoor},
		{Title: "部屋の掃除をする", Description: "部屋全体を掃除機がけする", Status: models.StatusTodo, Priority: models.PriorityMedium, Category: models.CategoryIndoor},
		{Title: "確定申告の書類を整理する", Description: "領収書を仕分けする", Status: models.StatusTodo, Priority: models.PriorityHigh, Category: models.CategoryAny},
		{Title: "友人に連絡する", Description: "近況報告のメッセージを送る", Status: models.StatusTodo, Priority: models.PriorityLow, Category: models.CategoryAny},
	}
	if err := DB.Create(&seed).Error; err != nil {
		log.Printf("seed insert failed: %v", err)
	} else {
		log.Println("seeded initial tasks")
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
