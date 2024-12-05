import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { register } from '../service/users';
import { useToast } from 'native-base';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.show({
        title: "Ошибка",
        description: "Заполните все поля",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        title: "Ошибка",
        description: "Пароли не совпадают",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
      return;
    }

    try {
      setLoading(true);
      await register({email: email.trim(), password: password, name: name.trim(), last_name: lastName.trim()});
      toast.show({
        title: "Успешно",
        description: "Регистрация выполнена",
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
        description: "Не удалось зарегистрироваться",
        placement: "top",
        duration: 3000,
        backgroundColor: "error.500",
        _title: { color: "white" },
        _description: { color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
        keyboardType="email-address"
      />
       <TextInput
        style={styles.input}
        placeholder="Фамилия"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Text>
      </Pressable>
      <Pressable 
        style={styles.linkButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </Pressable>
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
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
