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

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<INoteRes | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpenAlert, setIsCloseAlert } = useDeleteAlert();
  const toast = useToast();

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
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-20, 20]} // Активируем жест только при горизонтальном движении
        failOffsetY={[-20, 20]} // Отменяем жест при вертикальном движении
      >
        <View style={styles.container}>
          {loading ? (
            <Center flex={1}>
              <Spinner size="lg" />
            </Center>
          ) : note ? (
            <ScrollView 
              style={styles.content}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.title}>{note.title}</Text>
              <Text style={styles.text}>{note.description}</Text>
            </ScrollView>
          ) : (
            <Center flex={1}>
              <Text>Заметка не найдена</Text>
            </Center>
          )}

          <Modal
            isVisible={isOpenAlert}
            onBackdropPress={setIsCloseAlert}
            onBackButtonPress={setIsCloseAlert}
            useNativeDriver
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Удалить заметку?</Text>
              <Text style={styles.modalText}>
                Это действие нельзя будет отменить
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={setIsCloseAlert}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
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
    backgroundColor: '#fff',
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
    backgroundColor: 'white',
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
    color: '#666',
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
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
