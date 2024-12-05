import { View, StyleSheet, Text, RefreshControl, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { getAllMy } from '../../service/notes';
import { RootResNotes } from '@/types/note.types';
import { useFont } from "@shopify/react-native-skia";
import { router } from 'expo-router';

export default function NotesScreen() {
  const [notes, setNotes] = useState<RootResNotes[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const font = useFont(require('../assets/fonts/Roboto-Regular.ttf'), 14);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getAllMy();
      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  if (!font) return null;

  const renderItem = ({ item, index }) => (
    <Pressable 
      style={styles.itemContainer}
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <View style={styles.canvas}>
        <Text
          style={{color: "#000000", flexWrap: "wrap", width: "100%"}}>
            {item.title}
          </Text>
        <Text
        style={{color: "#666666", flexWrap: "wrap", width: "100%"}}>
            {item.description.substring(0, 100) + '...'}
          </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadNotes}/>}
      />
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
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    flexWrap: "wrap",
    padding: 10,
  },
});
