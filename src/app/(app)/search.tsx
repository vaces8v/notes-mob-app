import { View, StyleSheet, Text, RefreshControl, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { getAllMy } from '../../service/notes';
import { RootResNotes } from '@/types/note.types';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Box, Icon, Input, VStack, HStack, Center, Spinner } from 'native-base';
import {format} from "date-fns";

export default function SearchScreen() {
  const [notes, setNotes] = useState<RootResNotes[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<RootResNotes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes([]);
    } else {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getAllMy();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && styles.itemPressed
      ]}
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <VStack space={2} style={styles.canvas}>
        <HStack space={2} alignItems="center">
          <Icon 
            as={MaterialIcons}
            name="note"
            size="sm"
            color="gray.500"
          />
          <Text style={styles.title}>
            {item.title}
          </Text>
        </HStack>
        <Text style={styles.description}>
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Text>
        <HStack space={2} alignItems="center">
          <Icon 
            as={MaterialIcons}
            name="access-time"
            size="xs"
            color="gray.400"
          />
          <Text style={styles.date}>
            Создано: {format(item.created_at, "yyyy.MM.dd")} в {format(item.created_at, "HH:mm")}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Box p={4} bg="white" shadow={2}>
        <Input
          placeholder="Поиск заметок..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          size="lg"
          borderRadius="10"
          autoFocus
          InputLeftElement={
            <Icon
              as={MaterialIcons}
              name="search"
              size="sm"
              color="gray.400"
              ml={3}
            />
          }
          InputRightElement={
            searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon
                  as={MaterialIcons}
                  name="close"
                  size="sm"
                  color="gray.400"
                  mr={3}
                />
              </Pressable>
            ) : null
          }
        />
      </Box>
      
      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <FlashList
          data={filteredNotes}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadNotes} />
          }
          ListEmptyComponent={
            <Center flex={1} pt={10}>
              <Icon 
                as={MaterialIcons}
                name={searchQuery ? "search-off" : "search"}
                size="4xl"
                color="gray.300"
              />
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'Заметки не найдены'
                  : 'Начните поиск'}
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
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
    color: '#1a1a1a',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});