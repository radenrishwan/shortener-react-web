package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB() *gorm.DB {
	//username := os.Getenv("DB_USERNAME")
	//password := os.Getenv("DB_PASSWORD")
	//host := os.Getenv("DB_HOST")
	//port := os.Getenv("DB_PORT")
	//database := os.Getenv("DB_DATABASE")

	//dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", host, username, password, database, port)
	//dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, database)
	db, err := gorm.Open(postgres.Open("host=db.qhtkbdtgucrwrqqzwktm.supabase.co user=postgres password=y9Q99wwLs6Y3B4L dbname=postgres port=5432"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return db
}
