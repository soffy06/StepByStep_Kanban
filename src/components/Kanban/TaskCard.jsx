function TaskCard({ task, isDragging }) {
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ff6b6b',
      medium: '#feca57',
      low: '#48dbfb'
    };
    return colors[priority] || '#ddd';
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
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {{ high: 'Alta', medium: 'Media', low: 'Baja' }[task.priority] || task.priority}
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
          {task.startDate && task.endDate && (
            <span>
              📅 {formatDate(task.startDate)} → {formatDate(task.endDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;