import { useState } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import '../../styles/components/Timeline.css';

function TaskTimeline({ tasks }) {
const [selectedTask, setSelectedTask] = useState(null);  
  const { timeline, loading, addTimelineEntry, deleteTimelineEntry } = useTimeline(
    selectedTask?.id || null,
    null
  );

  const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('¿Eliminar este registro?')) {
      deleteTimelineEntry(entryId);
    }
  };

  const handleAddEntry = () => {
    if (!selectedTask) {
      alert('Primero selecciona una tarea');
      return;
    }
    
    const hours = prompt('Horas trabajadas:');
    if (hours === null) return;
    
    const comment = prompt('Comentario:');
    if (comment === null) return;
    
    const statusInput = prompt('Estado (escribe el número):\n1 = Por hacer\n2 = En progreso\n3 = En revisión\n4 = Hecho');
    if (statusInput === null) return;

    const statusMap = {
      '1': 'todo',
      '2': 'in-progress',
      '3': 'review',
      '4': 'done'
    };
    const status = statusMap[statusInput.trim()];

    if (!status) {
      alert('Estado inválido. Escribe un número del 1 al 4.');
      return;
    }
    
    if (hours && comment) {
      addTimelineEntry({
        taskId: selectedTask.id,
        userId: 'usuario-actual',
        date: (() => {
          const d = new Date();
          const offset = d.getTimezoneOffset();
          const local = new Date(d.getTime() - offset * 60000);
          return local.toISOString().split('T')[0];
        })(),
        hoursWorked: parseFloat(hours),
        comment,
        status
      });
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <select 
          onChange={(e) => {
            const task = tasks.find(t => t.id === e.target.value);
            setSelectedTask(task);
          }}
          defaultValue=""
        >
          <option value="">Seleccionar tarea</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        
        <button 
          onClick={handleAddEntry}
          disabled={!selectedTask}
          className="btn-primary"
        >
          + Agregar Registro
        </button>
      </div>

      {selectedTask && (
        <div className="timeline-task-info">
          <h3>{selectedTask.title}</h3>
          <p>{selectedTask.description || 'Sin descripción'}</p>
        </div>
      )}

      <div className="timeline-list">
        {loading ? (
          <p>Cargando...</p>
        ) : timeline.length === 0 ? (
          <p className="empty-state">No hay registros de tiempo para esta tarea</p>
        ) : (
          timeline.map(entry => (
            <div key={entry.id} className="timeline-entry">
              <div className="entry-date">{formatDate(entry.date)}</div>
              <div className="entry-content">
                <div className="entry-header">
                  <span className="entry-hours">⏱️ {entry.hoursWorked}h</span>
                  <span className={`entry-status ${entry.status}`}>
                    {{ todo: 'Por hacer', 'in-progress': 'En progreso', review: 'En revisión', done: 'Hecho' }[entry.status] || entry.status}
                  </span>
                </div>
                <div className="entry-comment">{entry.comment}</div>
              </div>
              <button
                className="entry-delete-btn"
                onClick={() => handleDeleteEntry(entry.id)}
                title="Eliminar registro"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskTimeline;