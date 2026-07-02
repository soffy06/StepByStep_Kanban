import { useState, useEffect } from 'react';
import { 
  tasksCollection, 
  timelineCollection,
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  doc, 
  onSnapshot,
  query,
  orderBy,
  where
} from '../config/firebase';
export const useFirestore = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(tasksCollection, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const addTask = async (taskData) => {
    try {
      const docRef = await addDoc(tasksCollection, {
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };
  const updateTask = async (id, data) => {
    try {
      await updateDoc(doc(tasksCollection, id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
  const deleteTask = async (id) => {
    try {
      // Borrar la tarea
      await deleteDoc(doc(tasksCollection, id));
      // Borrar todos los registros de timeline de esa tarea
      const timelineQuery = query(timelineCollection, where("taskId", "==", id));
      const snapshot = await getDocs(timelineQuery);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(timelineCollection, d.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };
  return { tasks, loading, addTask, updateTask, deleteTask };
}; 