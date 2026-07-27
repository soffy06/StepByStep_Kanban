import { useState, useEffect } from 'react';

export const CurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

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

  return <p className="project-info">{currentDateTime}</p>;
};