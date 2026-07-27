// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useState, useEffect, useCallback } from 'react';
import KanbanBoard from './components/Kanban/KanbanBoard';
import GanttChart from './components/Gantt/GanttChart';
import TaskTimeline from './components/Timeline/TaskTimeline';
import TaskModal from './components/Modals/TaskModal';
import HelpModal from './components/Modals/HelpModal';
import { RocketLoader } from './components/Loading/RocketLoader';
import { useFirestore } from './hooks/useFirestore';
import './styles/App.css';

function AppContent() {
  const { logout } = useAuth();
  const [view, setView] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const { tasks, loading, error, addTask, updateTask, deleteTask } = useFirestore();

  // Reloj en tiempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('es-CR', { dateStyle: 'full', timeStyle: 'short' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ocultar loader
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSaveTask = useCallback((data) => {
    if (selectedTask) {
      updateTask(selectedTask.id, data);
    } else {
      addTask(data);
    }
    setShowModal(false);
  }, [selectedTask, updateTask, addTask]);

  const handleDeleteTask = useCallback(() => {
    if (selectedTask && window.confirm('¿Eliminar esta tarea?')) {
      deleteTask(selectedTask.id);
      setShowModal(false);
    }
  }, [selectedTask, deleteTask]);

  if (loading || isLoading) return <RocketLoader />;
  if (error) return <div className="error-container">⚠️ {error.message}</div>;

  return (
    <div className="app">
      {/* HEADER COMPLETO */}
      <header className="app-header">
        <div>
          <h1>
            <img
              src="/Images/rocket-loading.gif"
              alt="Step By Step Kanban"
              className="header-logo"
            />
            Step By Step Kanban
          </h1>
          <p className="project-info">Sistema para la gestión de proyectos</p>
          <p className="project-info">{currentDateTime}</p>
        </div>

        <div className="nav-buttons" role="tablist">
          {['kanban', 'gantt', 'timeline'].map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={view === v ? 'active' : ''}
              onClick={() => setView(v)}
            >
              {v === 'kanban' && 'Tablero'}
              {v === 'gantt' && 'Cronograma'}
              {v === 'timeline' && 'Línea de tiempo'}
            </button>
          ))}
          <button
            className="btn-primary"
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
          >
            + Nueva Tarea
          </button>
          <button className="btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
          <button className="floating-help" onClick={() => setShowHelp(true)}>
            💬 Preguntas
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
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
        {view === 'gantt' && <GanttChart tasks={tasks} />}
        {view === 'timeline' && <TaskTimeline tasks={tasks} />}
      </main>

      {/* MODALES */}
      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
          onDelete={selectedTask ? handleDeleteTask : null}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<ProtectedRoute><AppContent /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;