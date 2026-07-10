package models

import "time"

type TaskStatus string

const (
	StatusTodo       TaskStatus = "todo"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

type TaskCategory string

const (
	CategoryOutdoor TaskCategory = "outdoor"
	CategoryIndoor  TaskCategory = "indoor"
	CategoryAny     TaskCategory = "any"
)

type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

type Task struct {
	ID          uint         `gorm:"primaryKey" json:"id"`
	Title       string       `gorm:"not null" json:"title"`
	Description string       `json:"description"`
	Status      TaskStatus   `gorm:"type:varchar(20);default:'todo'" json:"status"`
	Priority    Priority     `gorm:"type:varchar(10);default:'medium'" json:"priority"`
	Category    TaskCategory `gorm:"type:varchar(10);default:'any'" json:"category"`
	DueDate     *time.Time   `json:"due_date"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}
