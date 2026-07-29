// src/components/Kanban/TaskCard.jsx
function TaskCard({ task, isDragging }) {
  const getPriorityLabel = (priority) => {
    const labels = {
      Alta: 'Alta',
      Media: 'Media',
      Baja: 'Baja'
    };
    return labels[priority] || priority;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className="priority-badge">
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div className="task-assignee">
          👤 {task.assignedTo || 'Sin asignar'}
        </div>

        <div className="task-date">
          {task.startDate && task.dueDate && (
            <span>
              📅 {formatDate(task.startDate)} → {formatDate(task.dueDate)}
            </span>
          )}
          {task.dueDate && !task.startDate && (
            <span>📅 Vence: {formatDate(task.dueDate)}</span>
          )}
        </div>
      </div>

      {task.estimatedHours && (
        <div className="task-hours">
          ⏱️ {task.estimatedHours}h
        </div>
      )}
    </div>
  );
}

export default TaskCard;