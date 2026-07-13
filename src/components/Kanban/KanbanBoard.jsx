import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import '../../styles/components/Kanban.css';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'in-progress', title: 'En Progreso' },
  { id: 'review', title: 'En Revisión' },
  { id: 'done', title: 'Completado' }
];

// Orden de prioridades
const PRIORITY_ORDER = {
  high: 1,
  medium: 2,
  low: 3
};

function KanbanBoard({ tasks, onTaskClick, onUpdateTask }) {

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId;
    const task = tasks.find(t => t.id === draggableId);

    if (!task) return;

    if (task.status !== newStatus) {
      onUpdateTask(draggableId, { status: newStatus });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">

        {COLUMNS.map((column) => {

          // Filtrar y ordenar tareas
          const columnTasks = tasks
            .filter(t => t.status === column.id)
            .sort((a, b) => {

              // Primero por prioridad
              const priorityDiff =
                PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];

              if (priorityDiff !== 0) return priorityDiff;

              // Luego por fecha de inicio
              if (!a.startDate) return 1;
              if (!b.startDate) return -1;

              return new Date(a.startDate) - new Date(b.startDate);
            });

          return (
            <div key={column.id} className="kanban-column">

              <div className="column-header">
                <h2>{column.title}</h2>

                <span className="task-count">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-tasks ${
                      snapshot.isDraggingOver ? 'drag-over' : ''
                    }`}
                  >

                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onTaskClick(task)}
                          >
                            <TaskCard
                              task={task}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                  </div>
                )}
              </Droppable>

            </div>
          );
        })}

      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;