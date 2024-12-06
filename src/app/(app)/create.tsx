import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { create } from '../../service/notes';
import { useToast, useColorMode } from 'native-base';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
            borderColor: isDarkMode ? '#333' : '#ddd',
            color: isDarkMode ? '#fff' : '#000'
          }
        ]}
        placeholder="Заголовок"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
            borderColor: isDarkMode ? '#333' : '#ddd',
            color: isDarkMode ? '#fff' : '#000'
          }
        ]}
        placeholder="Описание"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />
      <Pressable 
        style={[
          styles.button,
          loading && styles.buttonDisabled,
          { backgroundColor: isDarkMode ? '#0A84FF' : '#007AFF' }
        ]}
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 200,
  },
  button: {
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
