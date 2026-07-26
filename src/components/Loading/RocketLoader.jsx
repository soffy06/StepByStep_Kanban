// src/components/Loading/RocketLoader.jsx
import { useEffect, useState, useRef } from 'react';
import '../../styles/components/Loading/RocketLoader.css';

export const RocketLoader = () => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const duration = 3000; // 3 segundos

  useEffect(() => {
    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = time - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Calcular segundos restantes para el texto (redondeo hacia arriba)
  const secondsLeft = Math.ceil((100 - progress) / 100 * 3);

  return (
    <div className="rocket-loader-container">
      <div className="rocket-loader-content">
        <div className="rocket-wrapper">
          <img 
            src="/Images/rocket-loading.gif"
            alt="Cohete despegando..."
            className="rocket-gif"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.style.cssText = 'font-size: 120px; display: block; animation: rocketFloat 2s ease-in-out infinite;';
              fallback.textContent = '🚀';
              e.target.parentElement.appendChild(fallback);
            }}
          />
         
        </div>
        
        <h2 className="loading-title">Step by Step Kanban</h2>
        
        <div className="loading-progress">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="loading-subtitle">
          {progress < 100 
            ? `` 
            : '¡Bienvenido!'}
        </p>
      </div>
    </div>
  );
};