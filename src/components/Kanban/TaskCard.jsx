// src/components/Kanban/TaskCard.jsx
function TaskCard({ task, isDragging }) {
  const getPriorityColor = (priority) => {
    const colors = {
      Alta: '#ff6b6b',
      Media: '#feca57',
      Baja: '#48dbfb'
    };
    return colors[priority] || '#ddd';
  };

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

  // Función para calcular días restantes/atrasados
  const getDaysDiff = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    // Resetear horas para comparar solo fechas
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysDiff = getDaysDiff(task.dueDate);
  let statusText = '';
  let statusClass = '';

  if (daysDiff !== null) {
    if (daysDiff < 0) {
      statusText = `🔴 ${Math.abs(daysDiff)} días atrasado`;
      statusClass = 'overdue';
    } else if (daysDiff === 0) {
      statusText = '🟡 Vence hoy';
      statusClass = 'today';
    } else {
      statusText = `🟢 ${daysDiff} días restantes`;
      statusClass = 'future';
    }
  }

  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
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

      {/* Indicador de días restantes/atrasados */}
      {daysDiff !== null && (
        <div className={`task-status ${statusClass}`}>
          {statusText}
        </div>
      )}

      {task.estimatedHours && (
        <div className="task-hours">
          ⏱️ {task.estimatedHours}h
        </div>
      )}
    </div>
  );
}

export default TaskCard;