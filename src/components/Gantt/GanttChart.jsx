import { useState } from 'react';
import '../../styles/components/Gantt.css';

function GanttChart({ tasks }) {
  const [filterUser, setFilterUser] = useState('all');
  
  const users = ['all', ...new Set(tasks.map(t => t.assignedTo).filter(Boolean))];
  
  const filteredTasks = filterUser === 'all' 
    ? tasks 
    : tasks.filter(t => t.assignedTo === filterUser);

  const allDates = tasks.flatMap(t => [t.startDate, t.endDate]).filter(Boolean);
  
  if (allDates.length === 0) {
    return (
      <div className="gantt-container">
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No hay tareas con fechas para mostrar en el diagrama de Gantt
        </p>
      </div>
    );
  }

  const minDate = new Date(Math.min(...allDates.map(d => new Date(d))));
  const maxDate = new Date(Math.max(...allDates.map(d => new Date(d))));
  
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) || 30;
  
  const getTaskPosition = (startDate) => {
    const start = new Date(startDate);
    return Math.ceil((start - minDate) / (1000 * 60 * 60 * 24));
  };

  const getTaskWidth = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
  };

  return (
    <div className="gantt-container">
      <div className="gantt-controls">
        <label>
          Filtrar por persona:
          <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            {users.map(user => (
              <option key={user} value={user}>
                {user === 'all' ? 'Todos' : user}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div className="gantt-chart">
        <div className="gantt-header">
          <div className="gantt-task-name">Tarea</div>
          <div className="gantt-timeline">
            <div className="gantt-day-label">Días hábiles</div>
            <div className="gantt-days-row">
              {Array.from({ length: Math.min(totalDays, 60) }, (_, i) => (
                <div key={i} className="gantt-day">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {filteredTasks.map(task => {
          if (!task.startDate || !task.endDate) return null;
          
          const left = getTaskPosition(task.startDate);
          const width = getTaskWidth(task.startDate, task.endDate);
          
          return (
            <div key={task.id} className="gantt-row">
              <div className="gantt-task-name">{task.title}</div>
              <div className="gantt-bars">
                <div 
                  className="gantt-bar"
                  style={{
                    marginLeft: `${(left / totalDays) * 100}%`,
                    width: `${(width / totalDays) * 100}%`,
                    backgroundColor: task.status === 'done' ? '#4caf50' : '#2196f3'
                  }}
                  title={`${task.title} (${task.startDate} - ${task.endDate})`}
                >
                  {task.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GanttChart;