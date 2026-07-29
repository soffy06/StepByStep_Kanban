// src/components/Modals/TaskModal.jsx
import { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    startDate: '',
    dueDate: '',
    priority: 'Baja',
    assignedTo: '',
    tags: '',
    estimatedHours: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const getLocalToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalToday();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pendiente',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'Baja',
        assignedTo: task.assignedTo || '',
        tags: task.tags || '',
        estimatedHours: task.estimatedHours || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'title' && errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }

    if (name === 'startDate' && errors.startDate && value) {
      setErrors(prev => ({ ...prev, startDate: '' }));
    }

    if (name === 'dueDate' && errors.dueDate && value) {
      setErrors(prev => ({ ...prev, dueDate: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    if (name === 'title') validateTitle();
    if (name === 'startDate') validateStartDate();
    if (name === 'dueDate') validateDueDate();
  };

  const validateTitle = () => {
    if (!formData.title.trim()) {
      setErrors(prev => ({
        ...prev,
        title: 'El título es obligatorio'
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      title: ''
    }));

    return true;
  };

  const validateStartDate = () => {
    if (!formData.startDate) {
      setErrors(prev => ({
        ...prev,
        startDate: 'La fecha de inicio es obligatoria'
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      startDate: ''
    }));

    return true;
  };

  const validateDueDate = () => {
    if (!formData.dueDate) {
      setErrors(prev => ({
        ...prev,
        dueDate: 'La fecha de vencimiento es obligatoria'
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      dueDate: ''
    }));

    return true;
  };

  const validateForm = () => {
    const isTitleValid = validateTitle();
    const isStartDateValid = validateStartDate();
    const isDueDateValid = validateDueDate();

    return (
      isTitleValid &&
      isStartDateValid &&
      isDueDateValid
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      startDate: true,
      dueDate: true
    });

    if (validateForm()) {
      onSave({
        ...formData,
        estimatedHours: formData.estimatedHours
          ? Number(formData.estimatedHours)
          : null
      });
    } else {
      const firstError = document.querySelector('.error-message');

      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
      ? errors[fieldName]
      : '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>{task ? '✏️ Editar Tarea' : '📄 Nueva Tarea'}</h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Título + Estado */}
          <div className="form-row">

            <div className="form-group half">
              <label>Título *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingresa el título"
                className={getFieldError('title') ? 'input-error' : ''}
              />

              {getFieldError('title') && (
                <div className="error-message">
                  {getFieldError('title')}
                </div>
              )}
            </div>

            <div className="form-group half">
              <label>Estado</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pendiente">📋 Pendiente</option>
                <option value="En Progreso">🔄 En Progreso</option>
                <option value="En Revisión">🔍 En Revisión</option>
                <option value="Completado">✅ Completado</option>
              </select>
            </div>

          </div>

          {/* Prioridad + Horas */}
          <div className="form-row">

            <div className="form-group half">
              <label>⚡ Prioridad</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div className="form-group half">
              <label>⏱️ Horas estimadas</label>

              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                placeholder="Ej: 8"
                min="0"
                step="0.5"
              />
            </div>

          </div>

          {/* Fechas */}
          <div className="form-row">

            <div className="form-group half">
              <label>📅 Fecha de inicio *</label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min={today}
                max={formData.dueDate || undefined}
                className={`date-input ${
                  getFieldError('startDate') ? 'input-error' : ''
                }`}
              />

              {getFieldError('startDate') && (
                <div className="error-message">
                  {getFieldError('startDate')}
                </div>
              )}
            </div>

            <div className="form-group half">
              <label>📅 Fecha de vencimiento *</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min={formData.startDate || today}
                className={`date-input ${
                  getFieldError('dueDate') ? 'input-error' : ''
                }`}
              />

              {getFieldError('dueDate') && (
                <div className="error-message">
                  {getFieldError('dueDate')}
                </div>
              )}
            </div>

          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe la tarea..."
            />
          </div>

          {/* Asignado + Etiquetas */}
          <div className="form-row">

            <div className="form-group half">
              <label>👤 Asignado a</label>

              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Nombre de la persona"
              />
            </div>

            <div className="form-group half">
              <label>🏷️ Etiquetas</label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Ej: frontend, urgente"
              />
            </div>

          </div>

          {/* Botones */}
          <div className="modal-actions">

            <button type="submit" className="btn-primary">
              {task ? '💾 Actualizar' : '✅ Crear'}
            </button>

            {onDelete && (
              <button
                type="button"
                className="btn-danger"
                onClick={onDelete}
              >
                🗑️ Eliminar
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              ❌ Cancelar
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;