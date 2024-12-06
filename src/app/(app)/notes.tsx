import { View, StyleSheet, Text, RefreshControl, Pressable, TextInput, Animated } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState, useCallback } from 'react';
import { getAllMy } from '../../service/notes';
import { RootResNotes } from '@/types/note.types';
import { useFont } from "@shopify/react-native-skia";
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Icon, VStack, HStack, Center, Spinner, useColorMode } from 'native-base';

export default function NotesScreen() {
  const [notes, setNotes] = useState<RootResNotes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const font = useFont(require('../assets/fonts/Roboto-Regular.ttf'), 14);
  const { refresh } = useLocalSearchParams();
  const { colorMode } = useColorMode();

  useEffect(() => {
    loadNotes();
  }, [refresh, colorMode]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getAllMy();
      setNotes(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!font) return null;

  const renderItem = ({ item }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && styles.itemPressed,
        { backgroundColor: colorMode === 'dark' ? '#2a2a2a' : '#ffffff' }
      ]}
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <VStack space={2} style={styles.canvas}>
        <HStack space={2} alignItems="center">
          <Text style={[styles.title, { color: colorMode === 'dark' ? '#fff' : '#1a1a1a' }]}>
            {item.title}
          </Text>
        </HStack>
        <Text style={[styles.description, { color: colorMode === 'dark' ? '#ccc' : '#666666' }]}>
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Text>
        <HStack space={2} alignItems="center">
          <Icon 
            as={MaterialIcons}
            name="access-time"
            size="xs"
            color={colorMode === 'dark' ? "gray.300" : "gray.400"}
          />
          <Text style={[styles.date, { color: colorMode === 'dark' ? '#999' : '#999999' }]}>
            Создано: {format(item.created_at, "yyyy.MM.dd")} в {format(item.created_at, "HH:mm")}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorMode === 'dark' ? '#1a1a1a' : '#fff' }]}>      
      {loading && notes.length === 0 ? (
        <Center flex={1}>
          <Spinner size="lg" color={colorMode === 'dark' ? "white" : "blue.500"} />
        </Center>
      ) : (
        <FlashList
          data={notes}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={loadNotes}
              tintColor={colorMode === 'dark' ? "#fff" : "#000"}
            />
          }
          ListEmptyComponent={
            <Center flex={1}>
              <Text style={[styles.emptyText, { color: colorMode === 'dark' ? '#999' : '#999999' }]}>
                У вас пока нет заметок
              </Text>
            </Center>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  itemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  canvas: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});
