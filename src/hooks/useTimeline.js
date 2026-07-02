import { useState, useEffect } from 'react';
import { db, timelineCollection, onSnapshot, query, where, orderBy, addDoc, deleteDoc, doc } from '../config/firebase';

export const useTimeline = (taskId = null, userId = null) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(timelineCollection, orderBy("date", "asc"));
    
    if (taskId) {
      q = query(q, where("taskId", "==", taskId));
    }
    if (userId) {
      q = query(q, where("userId", "==", userId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTimeline(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [taskId, userId]);

  const addTimelineEntry = async (entryData) => {
    try {
      const docRef = await addDoc(timelineCollection, {
        ...entryData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding timeline entry:", error);
      throw error;
    }
  };

  const deleteTimelineEntry = async (entryId) => {
    try {
      await deleteDoc(doc(db, "timeline", entryId));
    } catch (error) {
      console.error("Error deleting timeline entry:", error);
      throw error;
    }
  };

  return { timeline, loading, addTimelineEntry, deleteTimelineEntry };
};