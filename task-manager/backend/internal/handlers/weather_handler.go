package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"taskmanager/internal/db"
	"taskmanager/internal/models"
	"taskmanager/internal/suggest"
	"taskmanager/internal/weather"
)

const (
	defaultLat = 35.6812 // Tokyo Station, used when the browser does not supply geolocation.
	defaultLon = 139.7671
)

func parseLatLon(c *gin.Context) (float64, float64) {
	lat := defaultLat
	lon := defaultLon
	if v := c.Query("lat"); v != "" {
		if parsed, err := strconv.ParseFloat(v, 64); err == nil {
			lat = parsed
		}
	}
	if v := c.Query("lon"); v != "" {
		if parsed, err := strconv.ParseFloat(v, 64); err == nil {
			lon = parsed
		}
	}
	return lat, lon
}

func GetWeather(c *gin.Context) {
	lat, lon := parseLatLon(c)

	cond, err := weather.FetchCurrent(lat, lon)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cond)
}

func GetSuggestions(c *gin.Context) {
	lat, lon := parseLatLon(c)

	cond, err := weather.FetchCurrent(lat, lon)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	var tasks []models.Task
	if err := db.DB.Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ranked := suggest.Rank(tasks, cond)

	c.JSON(http.StatusOK, gin.H{
		"weather":     cond,
		"suggestions": ranked,
	})
}
