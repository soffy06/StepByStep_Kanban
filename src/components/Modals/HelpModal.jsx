import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

const faqData = [
  {
    question: '📌 ¿Cómo creo una nueva tarea?',
    answer: 'Haz clic en el botón "+ Nueva Tarea" que está en la barra superior. Se abrirá un formulario donde podrás ingresar el título, descripción, fecha de vencimiento y asignar un responsable. Guarda los cambios y la tarea aparecerá en la columna "Pendiente".'
  },
  {
    question: '✏️ ¿Cómo edito o elimino una tarea existente?',
    answer: 'Haz clic sobre cualquier tarea en el tablero para abrir el modal de edición. Allí podrás modificar todos los campos. Si deseas eliminarla, verás un botón "Eliminar" en la parte inferior del modal (se te pedirá confirmación).'
  },
  {
    question: '🔄 ¿Cómo cambio el estado de una tarea (de "Pendiente" a "En Progreso", etc.)?',
    answer: 'Simplemente arrastra la tarjeta de la tarea y suéltala en la columna deseada. También puedes hacer clic en la tarea y cambiar el estado desde el desplegable dentro del modal de edición.'
  },
  {
    question: '📊 ¿Qué significan las columnas del tablero Kanban?',
    answer: 'Las columnas representan el flujo de trabajo: "Pendiente" (tareas por empezar), "En Progreso" (tareas en ejecución), "En Revisión" (tareas que necesitan verificación) y "Completado" (tareas finalizadas). Puedes mover tareas entre ellas según avance el trabajo.'
  },
  {
    question: '🗓️ ¿Cómo veo el cronograma (Gantt) o la línea de tiempo?',
    answer: 'En la barra superior encontrarás los botones "Cronograma" y "Línea de tiempo". Al hacer clic, cambiarás la vista para ver todas las tareas organizadas por fechas, lo que te ayudará a planificar mejor.'
  },
  {
    question: '💾 ¿Se guardan automáticamente los cambios que hago?',
    answer: 'Sí, cada vez que creas, editas, eliminas o mueves una tarea, los cambios se sincronizan en tiempo real con nuestra base de datos en la nube (Firebase). No necesitas guardar manualmente.'
  },
  {
    question: '⏰ ¿Qué pasa si cierro el navegador sin terminar una edición?',
    answer: 'Los cambios solo se guardan cuando haces clic en "Guardar" dentro del modal. Si cierras el navegador antes, la tarea no se modificará. Siempre es recomendable guardar antes de salir.'
  },
  {
    question: '🔔 ¿Cómo sé si una tarea está próxima a vencer?',
    answer: 'En las vistas de cronograma y línea de tiempo, las tareas se muestran con colores según su fecha de vencimiento (verde para futuro, amarillo para cercano, rojo para vencido). Además, en el tablero, las tarjetas muestran la fecha restante.'
  },
  {
    question: '📱 ¿La aplicación funciona en dispositivos móviles?',
    answer: 'Sí, el diseño es responsive y se adapta a tablets y teléfonos. Sin embargo, la función de arrastrar y soltar es más cómoda en pantallas grandes; en móviles puedes usar el modal de edición para cambiar el estado.'
  },
  {
    question: '🧩 ¿Qué hago si una tarea no se mueve al arrastrarla?',
    answer: 'Asegúrate de hacer clic y mantener presionado sobre la tarjeta, luego arrastra hasta la columna deseada y suelta. Si el problema persiste, actualiza la página o verifica tu conexión a internet.'
  },
  {
    question: '📋 ¿Puedo agregar más columnas al tablero?',
    answer: 'En esta versión, las columnas son fijas (Pendiente, En Progreso, En Revisión, Completado). Si necesitas personalizar el flujo de trabajo, puedes contactarnos mediante el formulario de esta sección y evaluaremos agregarlo en futuras actualizaciones.'
  }
];

export default function HelpModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { addDocument } = useFirestore();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    pregunta: ''
  });
  const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.pregunta) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Por favor completa los campos obligatorios: nombre, correo y pregunta.'
      });
      return;
    }
    setFormStatus({ submitting: true, success: false, error: '' });
    try {
      await addDocument('consultas', {
        ...formData,
        fecha: new Date().toISOString()
      });
      setFormStatus({ submitting: false, success: true, error: '' });
      setFormData({ nombre: '', correo: '', telefono: '', pregunta: '' });
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Error al enviar la consulta. Intenta de nuevo.'
      });
      console.error('Error al guardar consulta:', error);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>💬 Ayuda y contacto</h2>

        <div className="tabs">
          <button
            className={activeTab === 'faq' ? 'tab-active' : ''}
            onClick={() => setActiveTab('faq')}
          >
            Preguntas Frecuentes
          </button>
          <button
            className={activeTab === 'contact' ? 'tab-active' : ''}
            onClick={() => setActiveTab('contact')}
          >
            Formulario de Contacto
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'faq' && (
            <div className="faq-list">
              {faqData.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <div key={index} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleQuestion(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleQuestion(index);
                        }
                      }}
                      aria-expanded={isExpanded}
                    >
                      <span className="faq-icon">{isExpanded ? '🔽' : '▶️'}</span>
                      <span className="faq-question-text">{item.question}</span>
                    </div>
                    {isExpanded && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Enlace al PDF */}
              <a
                href={`${import.meta.env.BASE_URL}Documentacion.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="help-pdf-link"
              >
                📄 Ver documentación completa (PDF)
              </a>
            </div>
          )}

          {activeTab === 'contact' && (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pregunta">Pregunta o comentario *</label>
                <textarea
                  id="pregunta"
                  name="pregunta"
                  rows="4"
                  value={formData.pregunta}
                  onChange={handleChange}
                  required
                />
              </div>
              {formStatus.error && <div className="form-error">{formStatus.error}</div>}
              {formStatus.success && <div className="form-success">¡Consulta enviada con éxito! Gracias por contactarnos.</div>}
              <button type="submit" className="btn-primary" disabled={formStatus.submitting}>
                {formStatus.submitting ? 'Enviando...' : 'Enviar consulta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}