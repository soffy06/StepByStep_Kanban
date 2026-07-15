import { useState, useEffect } from 'react';
import KanbanBoard from './components/Kanban/KanbanBoard';
import GanttChart from './components/Gantt/GanttChart';
import TaskTimeline from './components/Timeline/TaskTimeline';
import TaskModal from './components/Modals/TaskModal';
import { useFirestore } from './hooks/useFirestore';
import './styles/App.css';

function App() {
  const [view, setView] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const { tasks, loading, addTask, updateTask, deleteTask } = useFirestore();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('es-CR', {
          dateStyle: 'full',
          timeStyle: 'short'
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">

      <header className="app-header">

        <div>
          <h1>🚀 Step By Step Kanban</h1>

          <p className="project-info">
            Sistema para la gestión de proyectos
          </p>

          <p className="project-info">
            {currentDateTime}
          </p>

        </div>

        <div className="nav-buttons">

          <button
            className={view === 'kanban' ? 'active' : ''}
            onClick={() => setView('kanban')}
          >
            Tablero
          </button>

          <button
            className={view === 'gantt' ? 'active' : ''}
            onClick={() => setView('gantt')}
          >
            Cronograma
          </button>

          <button
            className={view === 'timeline' ? 'active' : ''}
            onClick={() => setView('timeline')}
          >
            Línea de tiempo
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
          >
            + Nueva Tarea
          </button>

          <button
           className="floating-help"
           onClick={() => setShowHelp(true)}
>
           💬 Preguntas
          </button>

        </div>

      </header>

      <main className="app-main">

        {view === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onTaskClick={(task) => {
              setSelectedTask(task);
              setShowModal(true);
            }}
            onUpdateTask={updateTask}
          />
        )}

        {view === 'gantt' && (
          <GanttChart tasks={tasks} />
        )}

        {view === 'timeline' && (
          <TaskTimeline tasks={tasks} />
        )}

      </main>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (selectedTask) {
              updateTask(selectedTask.id, data);
            } else {
              addTask(data);
            }
            setShowModal(false);
          }}
          onDelete={
            selectedTask
              ? () => {
                  deleteTask(selectedTask.id);
                  setShowModal(false);
                }
              : null
          }
        />
      )}

      {showHelp && (
        <div
          className="modal-overlay"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

           <h2>💬 Preguntas o sugerencias</h2>

<p>
Si tienes alguna duda o comentario sobre el sistema,
escríbelo aquí.
</p>

<p style={{ marginTop: "10px" }}>
  📄 <a href="/Documentacion.pdf" target="_blank" rel="noopener noreferrer">
    Ver documentación (PDF)
  </a>
</p>

<textarea
  rows="6"
  placeholder="Escriba aquí su pregunta..."
  style={{
    width:"100%",
    marginTop:"15px",
    padding:"12px",
    borderRadius:"8px",
    resize:"none"
  }}
></textarea>

<div
style={{
display:"flex",
justifyContent:"flex-end",
gap:"10px",
marginTop:"20px"
}}
>


<button
className="btn-primary"
onClick={()=>{

alert("Pregunta enviada.");

setShowHelp(false);

}}
>
Enviar
</button>

</div>

            <button
              className="btn-primary"
              onClick={() => setShowHelp(false)}
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;