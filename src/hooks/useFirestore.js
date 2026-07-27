import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
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
  where,
  collection,
  db
} from '../config/firebase';

export const useFirestore = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay usuario autenticado, limpiar tareas
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log('👤 Usuario autenticado:', currentUser.uid);

    // Consulta con filtro por userId (sin orderBy para evitar índice)
    const q = query(
      tasksCollection,
      where('userId', '==', currentUser.uid)
    );

    console.log('📡 Escuchando cambios en tasks...');

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`📋 ${tasksData.length} tareas cargadas`);
        setTasks(tasksData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('❌ Error en onSnapshot:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // --- CRUD ---
  const addTask = useCallback(async (taskData) => {
    if (!currentUser) throw new Error('Usuario no autenticado');
    const newTask = {
      ...taskData,
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('📝 Guardando tarea:', newTask);
    try {
      const docRef = await addDoc(tasksCollection, newTask);
      console.log('✅ Tarea guardada ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateTask = useCallback(async (id, data) => {
    try {
      await updateDoc(doc(tasksCollection, id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Tarea actualizada:', id);
    } catch (error) {
      console.error('❌ Error actualizando:', error);
      setError(error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await deleteDoc(doc(tasksCollection, id));
      console.log('🗑️ Tarea eliminada:', id);
      // Eliminar timeline asociado
      const timelineQuery = query(timelineCollection, where('taskId', '==', id));
      const snapshot = await getDocs(timelineQuery);
      const deletePromises = snapshot.docs.map((d) =>
        deleteDoc(doc(timelineCollection, d.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('❌ Error eliminando:', error);
      setError(error);
      throw error;
    }
  }, []);

  const addDocument = useCallback(async (collectionName, data) => {
    try {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, {
        ...data,
        userId: currentUser?.uid || 'anonymous',
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error al agregar a ${collectionName}:`, error);
      setError(error);
      throw error;
    }
  }, [currentUser]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addDocument,
  };
};