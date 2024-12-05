import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { router } from 'expo-router';
import { useToast } from 'native-base';
import * as SecureStore from 'expo-secure-store';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const { login, isLoading } = useAuthStore();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        router.replace('/(app)/notes');
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(app)/notes');
      toast.show({
        title: "Успешный вход",
        description: "Добро пожаловать!",
        padding: 10,
        paddingRight: 15,
        paddingLeft: 15,
        placement: "top",
        duration: 3000,
        backgroundColor: "success.500",
        _title: {
          color: "white",
        },
        _description: {
          color: "white",
        },
      });
    } catch (error) {
      toast.show({
        title: "Ошибка авторизации",
        description: "Неверный email или пароль",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: {
          color: "white",
        },
        _description: {
          color: "white",
        },
      });
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
