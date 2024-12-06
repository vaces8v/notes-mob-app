import {useEffect, useState} from 'react';
import {Stack, usePathname} from 'expo-router';
import {useAuthStore} from '@/store/auth.store';
import {router} from 'expo-router';
import {Pressable} from 'react-native';
import {Box, Fab, Icon, useToast, useDisclose, Avatar, VStack, HStack, Button, AlertDialog} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import CustomDrawer from '@/components/CustomDrawer';
import React from 'react';
import { useDeleteAlert } from '@/store/deleteAlert.store';
import { useThemeStore } from '@/store/theme.store';

export default function AppLayout() {
    const {token, user, checkAuth, logout} = useAuthStore();
    const { isDarkMode } = useThemeStore();
    const path = usePathname();
    const {isOpen, onOpen, onClose} = useDisclose();
    const { setIsOpenAlert } = useDeleteAlert()

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
            <CustomDrawer isOpen={isOpen} onClose={onClose} user={user} onLogout={logout}/>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                    },
                    headerShown: false,
                    headerTintColor: isDarkMode ? '#fff' : '#000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: isDarkMode ? '#fff' : '#000',
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
                            <HStack space={2} alignItems="center" mr={4}>
                                <Pressable
                                    onPress={() => router.push('/search')}
                                    style={({pressed}) => ({
                                        opacity: pressed ? 0.7 : 1
                                    })}
                                >
                                    <Icon
                                        as={MaterialIcons}
                                        name="search"
                                        size="xl"
                                        color={isDarkMode ? "white" : "gray.600"}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={onOpen}
                                    style={({pressed}) => ({
                                        opacity: pressed ? 0.7 : 1
                                    })}
                                >
                                    <Icon
                                        as={MaterialIcons}
                                        name="menu"
                                        size="xl"
                                        color={isDarkMode ? "white" : "gray.600"}
                                    />
                                </Pressable>
                            </HStack>
                        ),
                    }}
                />
                <Stack.Screen
                    name="create"
                    options={{
                        title: 'Создать заметку',
                        headerShown: true,
                        headerRight: () => (
                            <Pressable
                                onPress={onOpen}
                                style={({pressed}) => ({
                                    marginRight: 16,
                                    opacity: pressed ? 0.7 : 1
                                })}
                            >
                                <Icon
                                    as={MaterialIcons}
                                    name="menu"
                                    size="xl"
                                    color={isDarkMode ? "white" : "gray.600"}
                                />
                            </Pressable>
                        ),
                    }}
                />
                <Stack.Screen
                    name="search"
                    options={{
                        title: 'Поиск',
                        headerShown: true,
                        animation: "fade_from_bottom",
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
                            <Pressable onPress={() => setIsOpenAlert()}>
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
                    size="lg"
                    icon={<Icon color="white" as={MaterialIcons} name="add" size="lg"/>}
                    colorScheme={isDarkMode ? "darkBlue" : "blue"}
                    bg={isDarkMode ? "#0A84FF" : "#007AFF"}
                    onPress={() => router.push('/create')}
                    bottom={30}
                    right={6}
                    shadow={3}
                />
            </Box>
        </>
    );
}
