import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { useAuthStore } from '@/store/auth.store';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import {StatusBar} from "expo-status-bar";
import * as SecureStore from 'expo-secure-store';
import { NativeBaseProvider } from 'native-base';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const { checkAuth } = useAuthStore();
    const [isReady, setIsReady] = useState(false);
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    });

    useEffect(() => {
        const init = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                await checkAuth();
                await SplashScreen.hideAsync();
                setIsReady(true);
                
                if (token) {
                    router.replace('/(app)/notes');
                }
            } catch (error) {
                await SplashScreen.hideAsync();
                setIsReady(true);
                router.replace('/');
            }
        };

        if (fontsLoaded) {
            init();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || !isReady) return null;

    return (
            <>
             <StatusBar style="inverted"/>
            <NativeBaseProvider>
                <SafeAreaProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            gestureEnabled: true,
                            gestureDirection: "horizontal",
                            animation: "ios_from_right"
                        }}>
                        <Stack.Screen 
                            name="index" 
                            options={{
                                title: 'Вход',
                                headerShown: false,
                            }} 
                        />
                        <Stack.Screen 
                            name="register" 
                            options={{
                                title: 'Регистрация',
                                headerShown: false,
                            }} 
                        />
                        <Stack.Screen 
                            name="(app)" 
                            options={{
                                headerShown: false,
                            }} 
                        />
                    </Stack>
                </SafeAreaProvider>
            </NativeBaseProvider>
            </>
    );
}
