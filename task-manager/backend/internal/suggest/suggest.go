package suggest

import (
	"sort"

	"taskmanager/internal/models"
	"taskmanager/internal/weather"
)

// Rank orders tasks by how well they fit the current weather condition.
// Tasks whose category matches the weather's "friendly" activity type
// (outdoor / indoor) are ranked first, "any" category tasks come next,
// and mismatched tasks (e.g. outdoor tasks during rain) are ranked last.
// Only tasks that are not yet done are considered.
func Rank(tasks []models.Task, cond *weather.Condition) []models.Task {
	pending := make([]models.Task, 0, len(tasks))
	for _, t := range tasks {
		if t.Status != models.StatusDone {
			pending = append(pending, t)
		}
	}

	score := func(t models.Task) int {
		switch {
		case string(t.Category) == cond.Friendly:
			return 0
		case t.Category == models.CategoryAny:
			return 1
		default:
			return 2
		}
	}

	priorityScore := func(p models.Priority) int {
		switch p {
		case models.PriorityHigh:
			return 0
		case models.PriorityMedium:
			return 1
		default:
			return 2
		}
	}

	ranked := make([]models.Task, len(pending))
	copy(ranked, pending)

	sort.SliceStable(ranked, func(i, j int) bool {
		si, sj := score(ranked[i]), score(ranked[j])
		if si != sj {
			return si < sj
		}
		return priorityScore(ranked[i].Priority) < priorityScore(ranked[j].Priority)
	})

	if len(ranked) > 5 {
		return ranked[:5]
	}
	return ranked
}
