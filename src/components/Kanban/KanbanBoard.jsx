import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import '../../styles/components/Kanban.css';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'in-progress', title: 'En Progreso' },
  { id: 'review', title: 'En Revisión' },
  { id: 'done', title: 'Completado' }
];

function KanbanBoard({ tasks, onTaskClick, onUpdateTask }) {

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;

    // si suelta fuera de una columna
    if (!destination) return;

    const newStatus = destination.droppableId;
    const task = tasks.find(t => t.id === draggableId);

    if (!task) return;

    // solo actualiza si cambia de columna
    if (task.status !== newStatus) {
      onUpdateTask(draggableId, { status: newStatus });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">

        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(t => t.status === column.id);

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