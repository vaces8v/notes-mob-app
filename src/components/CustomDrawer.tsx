import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { VStack, Avatar, Center, Icon, Box, Actionsheet, HStack, Switch, useColorMode } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { IUser } from '@/types/user.types';
import { useThemeStore } from '@/store/theme.store';

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onLogout: () => void;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, onClose, user, onLogout }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { toggleColorMode } = useColorMode();

  const handleThemeChange = () => {
    toggleTheme();
    toggleColorMode();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content bg={isDarkMode ? "gray.900" : "white"} minH="70%">
        <VStack space={4} p={4} flex={1} w="100%">
          <Center mt={4}>
            <Avatar 
              size="xl"
              bg="gray.500"
              source={null}
            >
              {`${user?.name?.[0]}${user?.last_name?.[0]}`}
            </Avatar>
          </Center>
          <VStack space={1} alignItems="center" mt={2}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: isDarkMode ? '#fff' : '#000' }}>
              {user?.name} {user?.last_name}
            </Text>
            <Text style={{ fontSize: 14, color: isDarkMode ? '#999' : '#666' }}>
              {user?.email}
            </Text>
          </VStack>
          
          <HStack space={2} alignItems="center" justifyContent="space-between" mt={4}>
            <HStack space={2} alignItems="center">
              <Icon 
                as={MaterialIcons}
                name={isDarkMode ? "dark-mode" : "light-mode"}
                size="sm"
                color={isDarkMode ? "white" : "gray.600"}
              />
              <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Темная тема</Text>
            </HStack>
            <Switch
              isChecked={isDarkMode}
              onToggle={handleThemeChange}
              colorScheme="primary"
            />
          </HStack>

          <Box flex={1}/>
          <Pressable 
            onPress={() => {
              onClose();
              onLogout();
            }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              backgroundColor: pressed ? (isDarkMode ? '#333' : '#f0f0f0') : 'transparent',
              borderRadius: 8,
              marginBottom: 20,
              alignSelf: 'center',
              width: 120
            })}
          >
            <HStack space={1} width="100%" alignItems="center">
              <Icon 
                as={MaterialIcons}
                name="logout"
                size="sm"
                color="error.500"
              />
              <Text style={{ color: '#FF4444', fontSize: 16 }}>Выйти</Text>
            </HStack>
          </Pressable>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default CustomDrawer;
