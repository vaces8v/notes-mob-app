import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { create } from '../../service/notes';
import { useToast } from 'native-base';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      toast.show({
        title: "Ошибка",
        description: "Заполните все поля",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
      return;
    }

    try {
      setLoading(true);
      await create({ title, description, noteTags:[]});
      toast.show({
        title: "Успешно",
        description: "Заметка создана",
        placement: "top",
        duration: 3000,
        backgroundColor: "success.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
      router.push('/notes');
    } catch (error) {
      toast.show({
        title: "Ошибка",
        description: "Не удалось создать заметку",
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Заголовок"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Создание...' : 'Создать заметку'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 200,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
