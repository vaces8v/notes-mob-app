import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { useAuthStore } from '@/store/auth.store';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as SecureStore from 'expo-secure-store';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useThemeStore } from '@/store/theme.store';

SplashScreen.preventAutoHideAsync();

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const theme = extendTheme({
  config,
  components: {
    AlertDialog: {
      defaultProps: {
        overlayVisible: true,
      },
    },
  },
});

export default function Layout() {
  const { checkAuth, token } = useAuthStore();
  const { isDarkMode } = useThemeStore();
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <BottomSheetModalProvider>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: "horizontal",
                contentStyle: {
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#fff'
                }
              }}>
              <Stack.Screen
                name="index"
                options={{
                  title: 'Вход',
                  headerShown: false,
                  animation: "fade"
                }}
              />
              <Stack.Screen
                name="register"
                options={{
                  title: 'Регистрация',
                  headerShown: false,
                  animation: "ios_from_right"
                }}
              />
              <Stack.Screen
                name="(app)"
                options={{
                  headerShown: false,
                  animation: "ios_from_right"
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
