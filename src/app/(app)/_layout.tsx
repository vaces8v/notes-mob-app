import { useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { Box, Center, Fab, Icon, useToast } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteNote } from '@/service/notes';

export default function AppLayout() {
  const { token, checkAuth, logout } = useAuthStore();
  const toast = useToast();
  const path = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!token) {
      router.replace('/');
    }
  }, [token]);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShown: false,
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="notes"
          options={{
            title: 'Мои заметки',
            headerShown: true,
            headerLeft: () => <></>, 
            headerRight: () => (
              <Pressable onPress={logout}>
                <Text style={{ marginRight: 10, color: '#007AFF' }}>Выйти</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: 'Создать заметку',
            headerShown: true,
            headerRight: () => (
              <Pressable onPress={logout}>
                <Text style={{ marginRight: 10, color: '#007AFF' }}>Выйти</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="note/[id]"
          options={{
            title: 'Заметка',
            headerShown: true,
            headerTitleAlign: "center",
            animation: "ios_from_right",
            headerRight: () => (
              <Pressable 
                onPress={async () => {
                  const noteId = path.split('/').pop();
                  try {
                    console.log(await deleteNote(Number(noteId)));
                    toast.show({
                      title: "Успешно",
                      description: "Заметка удалена",
                      placement: "top",
                      duration: 3000,
                      backgroundColor: "success.500",
                      _title: { color: "white" },
                      _description: { color: "white" },
                    });
                    router.replace('/notes');
                  } catch (error) {
                    toast.show({
                      title: "Ошибка",
                      description: "Не удалось удалить заметку",
                      placement: "top",
                      duration: 3000,
                      backgroundColor: "error.500",
                      _title: { color: "white" },
                      _description: { color: "white" },
                    });
                  }
                }}
              >
                <Icon 
                  as={MaterialIcons} 
                  name="delete" 
                  size="md" 
                  color="#FF3B30" 
                  marginRight={3}
                />
              </Pressable>
            ),
          }}
        />
      </Stack>
      <Box position="relative" display={path.includes('create') ? 'none' : 'flex'} h="0" w="100%">
        <Fab 
          position="absolute"
          renderInPortal={false}
          shadow={3}
          backgroundColor="gray.400"
          size="lg"
          icon={<Icon as={MaterialIcons} name="edit" size="lg" color="white" />}
          bottom={10}
          right={5}
          onPress={() => router.push('/create')}
        />
      </Box>
    </>
  );
}
