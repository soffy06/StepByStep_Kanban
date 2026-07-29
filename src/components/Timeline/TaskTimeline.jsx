// src/components/Timeline/TaskTimeline.jsx
import { useState } from 'react';
import '../../styles/components/Timeline.css';

const PRIORITY_LABELS = {
  'Alta': 'Alta',
  'Media': 'Media',
  'Baja': 'Baja'
};

const PRIORITY_ORDER = {
  'Alta': 1,
  'Media': 2,
  'Baja': 3
};

// Función de utilidad para cálculo de días
const getDaysDiff = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

function TaskTimeline({ tasks }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');

  const statuses = ['all', ...new Set(tasks.map(t => t.status).filter(Boolean))];
  const priorities = ['all', ...new Set(tasks.map(t => t.priority).filter(Boolean))];

  const filteredTasks = tasks
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => t.startDate || t.dueDate);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'startDate') {
      return new Date(a.startDate || '9999-12-31') - new Date(b.startDate || '9999-12-31');
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
    }
    if (sortBy === 'priority') {
      const priorityDiff = (PRIORITY_ORDER[a.priority] || 99) - (PRIORITY_ORDER[b.priority] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      // Si tienen la misma prioridad, ordenar por fecha de vencimiento más próxima
      return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
    }
    if (sortBy === 'status') {
      return a.status?.localeCompare(b.status || '');
    }
    return 0;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completado').length;
  const inProgressTasks = tasks.filter(t => t.status === 'En Progreso').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pendiente').length;

  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'Pendiente': '📋',
      'En Progreso': '🔄',
      'En Revisión': '🔍',
      'Completado': '✅'
    };
    return emojis[status] || '📌';
  };

  return (
    <div className="timeline-container">
      {/* Estadísticas */}
      <div className="timeline-stats">
        <div className="stat-item">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Total tareas</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{pendingTasks}</span>
          <span className="stat-label">📋 Pendientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{inProgressTasks}</span>
          <span className="stat-label">🔄 En progreso</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-label">✅ Completadas</span>
        </div>
      </div>

      {/* Controles */}
      <div className="timeline-controls">
        <div className="filter-group">
          <label>Estado:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'Todos' : `${getStatusEmoji(status)} ${status}`}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Prioridad:</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'Todas' : PRIORITY_LABELS[priority] || priority}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="startDate">📅 Fecha inicio</option>
            <option value="dueDate">📅 Fecha vencimiento</option>
            <option value="priority">⚡ Prioridad</option>
            <option value="status">📊 Estado</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="timeline-list">
        {sortedTasks.length === 0 ? (
          <div className="timeline-empty">
            <p>No hay tareas con fechas para mostrar</p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const daysDiff = getDaysDiff(task.dueDate);
            let statusText = '';

            if (daysDiff !== null) {
              if (daysDiff < 0) {
                statusText = `${Math.abs(daysDiff)} días atrasado`;
              } else if (daysDiff === 0) {
                statusText = 'Vence hoy';
              } else {
                statusText = `${daysDiff} días restantes`;
              }
            }

            return (
              <div key={task.id} className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3 className="timeline-title">{task.title}</h3>
                    <div className="timeline-badges">
                      <span className="status-badge">
                        {getStatusEmoji(task.status)} {task.status || 'Sin estado'}
                      </span>
                      <span className="priority-badge">
                        {PRIORITY_LABELS[task.priority] || task.priority || 'Sin prioridad'}
                      </span>
                    </div>
                  </div>

                  {task.description && (
                    <p className="timeline-description">{task.description}</p>
                  )}

                  <div className="timeline-details">
                    {task.assignedTo && (
                      <span className="detail-item">👤 {task.assignedTo}</span>
                    )}
                    {task.tags && (
                      <span className="detail-item">🏷️ {task.tags}</span>
                    )}
                    {task.estimatedHours && (
                      <span className="detail-item">⏱️ {task.estimatedHours}h</span>
                    )}
                  </div>

                  <div className="timeline-dates">
                    {task.startDate && (
                      <span className="date-item">
                        📅 Inicio: <strong>{formatDate(task.startDate)}</strong>
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="date-item">
                        ⏰ Vence: <strong>{formatDate(task.dueDate)}</strong>
                        {statusText && (
                          <span className="days-remaining"> ({statusText})</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TaskTimeline;