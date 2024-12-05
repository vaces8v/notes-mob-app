import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getById, deleteNote } from '../../../service/notes';
import { INoteRes } from '../../../types/note.types';
import { useToast } from 'native-base';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<INoteRes>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const data = await getById(Number(id));
      setNote(data);
    } catch (error) {
      console.error('Failed to load note:', error);
      toast.show({
        title: "Ошибка",
        description: "Не удалось загрузить заметку",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.description}>{note.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
