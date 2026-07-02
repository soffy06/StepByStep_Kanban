import { useState } from 'react';
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
  const { tasks, loading, addTask, updateTask, deleteTask } = useFirestore();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1> Step By Step</h1>
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

          {/* BOTÓN EN EL HEADER */}
          <button
            className="btn-primary"
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
          >
            + Nueva Tarea
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
          onDelete={selectedTask ? () => {
            deleteTask(selectedTask.id);
            setShowModal(false);
          } : null}
        />
      )}
    </div>
  );
}

export default App;