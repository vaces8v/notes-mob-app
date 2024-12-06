import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect } from 'react';
import { getById, deleteNote } from '../../../service/notes';
import { INoteRes } from '../../../types/note.types';
import { Center, Spinner, useToast, Icon, Pressable } from 'native-base';
import { useDeleteAlert } from '@/store/deleteAlert.store';
import Modal from 'react-native-modal';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useColorMode, useColorModeValue } from 'native-base';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<INoteRes | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpenAlert, setIsCloseAlert } = useDeleteAlert();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      const data = await getById(Number(id));
      setNote(data);
    } catch (error) {
      console.error('Failed to load note:', error);
      toast.show({
        description: 'Ошибка при загрузке заметки',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(Number(id));
      setIsCloseAlert();
      router.replace({
        pathname: "/notes",
        params: { refresh: Date.now().toString() }
      });
      toast.show({
        title: "Успешно",
        description: "Заметка удалена",
        placement: "top",
        duration: 3000,
        backgroundColor: "success.500",
        _title: {color: "white"},
        _description: {color: "white"},
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.show({
        description: 'Ошибка при удалении заметки',
        placement: 'top',
      });
    }
  };

  function onGestureEvent(event) {
    const { translationX, translationY } = event.nativeEvent;

    if (Math.abs(translationY) > Math.abs(translationX)) {
      return;
    }
  }

  function onHandlerStateChange(event) {
    const { translationX, translationY } = event.nativeEvent;
  
    if (Math.abs(translationY) > Math.abs(translationX)) {
      return;
    }

    if (event.nativeEvent.state === 5 && translationX > 70) {
      router.back();
    }
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-20, 20]}
        failOffsetY={[-20, 20]}
      >
        <View style={styles.container}>
          {loading ? (
            <Center flex={1}>
              <Spinner size="lg" color={isDarkMode ? "white" : "blue.500"} />
            </Center>
          ) : note ? (
            <ScrollView style={styles.content}>
              <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                {note.title}
              </Text>
              <Text style={[styles.text, { color: isDarkMode ? '#ccc' : '#333' }]}>
                {note.description}
              </Text>
            </ScrollView>
          ) : (
            <Center flex={1}>
              <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>
                Заметка не найдена
              </Text>
            </Center>
          )}

          <Modal
            isVisible={isOpenAlert}
            onBackdropPress={setIsCloseAlert}
            onBackButtonPress={setIsCloseAlert}
            useNativeDriver
            style={styles.modal}
          >
            <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : 'white' }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                Удалить заметку?
              </Text>
              <Text style={[styles.modalText, { color: isDarkMode ? '#999' : '#666' }]}>
                Это действие нельзя будет отменить
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>
                  Удалить
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={setIsCloseAlert}
              >
                <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#0A84FF' : '#007AFF' }]}>
                  Отмена
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
