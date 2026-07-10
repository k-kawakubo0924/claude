package weather

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type CurrentWeather struct {
	Temperature float64 `json:"temperature"`
	WindSpeed   float64 `json:"windspeed"`
	WeatherCode int     `json:"weathercode"`
	Time        string  `json:"time"`
}

type openMeteoResponse struct {
	CurrentWeather CurrentWeather `json:"current_weather"`
}

type Condition struct {
	Code        int     `json:"code"`
	Label       string  `json:"label"`
	Emoji       string  `json:"emoji"`
	Temperature float64 `json:"temperature"`
	WindSpeed   float64 `json:"wind_speed"`
	// Outdoor-friendliness derived from the WMO weather code.
	Friendly string `json:"friendly"` // "outdoor", "indoor", "any"
}

var httpClient = &http.Client{Timeout: 8 * time.Second}

func FetchCurrent(lat, lon float64) (*Condition, error) {
	url := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current_weather=true",
		lat, lon,
	)

	resp, err := httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("weather request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("weather api returned status %d", resp.StatusCode)
	}

	var parsed openMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return nil, fmt.Errorf("failed to decode weather response: %w", err)
	}

	label, emoji, friendly := interpret(parsed.CurrentWeather.WeatherCode)

	return &Condition{
		Code:        parsed.CurrentWeather.WeatherCode,
		Label:       label,
		Emoji:       emoji,
		Temperature: parsed.CurrentWeather.Temperature,
		WindSpeed:   parsed.CurrentWeather.WindSpeed,
		Friendly:    friendly,
	}, nil
}

// interpret maps WMO weather interpretation codes to a human label,
// emoji, and whether the condition favors outdoor or indoor activity.
func interpret(code int) (label, emoji, friendly string) {
	switch {
	case code == 0:
		return "快晴", "☀️", "outdoor"
	case code == 1 || code == 2:
		return "晴れ時々曇り", "🌤️", "outdoor"
	case code == 3:
		return "曇り", "☁️", "any"
	case code == 45 || code == 48:
		return "霧", "🌫️", "indoor"
	case code >= 51 && code <= 57:
		return "霧雨", "🌦️", "indoor"
	case code >= 61 && code <= 67:
		return "雨", "🌧️", "indoor"
	case code >= 71 && code <= 77:
		return "雪", "❄️", "indoor"
	case code >= 80 && code <= 82:
		return "にわか雨", "🌧️", "indoor"
	case code == 85 || code == 86:
		return "にわか雪", "🌨️", "indoor"
	case code >= 95:
		return "雷雨", "⛈️", "indoor"
	default:
		return "不明", "❓", "any"
	}
}
