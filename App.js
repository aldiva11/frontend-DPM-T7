import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TextInput, Button, Text, IconButton, Card } from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const API_URL = 'http://192.168.56.1:3000';

// Register API call
const registerUser = async (email, username, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
};

// Login API call
const loginUser = async (username, password, setLoggedInUser, setFullName, navigation) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setLoggedInUser(data.username);  // Set username
      setFullName(data.fullName);      // Set full name
      navigation.navigate('Main');
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
  }
};

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [fullName, setFullName] = useState('');  // State for full name

  // Register Screen
  const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <View style={styles.container}>
        <Text variant="headlineLarge">Register</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <TextInput label="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
        <Button mode="contained" onPress={() => registerUser(email, username, password)}>
          Register
        </Button>
        <Button onPress={() => navigation.navigate('Login')}>Go to Login</Button>
      </View>
    );
  };

  // Login Screen
  const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
      <View style={styles.container}>
        <Text variant="headlineLarge">Login</Text>
        <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <TextInput label="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
        <Button mode="contained" onPress={() => loginUser(username, password, setLoggedInUser, setFullName, navigation)}>
          Login
        </Button>
      </View>
    );
  };

  // Home Screen
  const HomeScreen = () => (
    <View style={styles.centered}>
      <Text variant="headlineLarge">Welcome to the Home Screen</Text>
      <Text style={styles.description}>Explore the app, check out the latest features, and stay connected with us!</Text>
    </View>
  );

  // Explore Screen
  const ExploreScreen = () => (
    <ScrollView contentContainerStyle={styles.centered}>
      <Text variant="headlineLarge">Explore</Text>
      <Text style={styles.description}>Check out these exciting features:</Text>
      <Card style={styles.card}>
        <Card.Title title="Feature 1" subtitle="Explore new functionalities" />
        <Card.Content>
          <Text>Learn about the latest updates and features in the app.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  // Profile Screen
  const ProfileScreen = ({ loggedInUser }) => (
    <View style={styles.centered}>
      <Text variant="headlineLarge">Profile</Text>
      <Text>Welcome, {loggedInUser || 'Guest'}!</Text> {/* Show username if logged in, otherwise 'Guest' */}
      <Text style={styles.description}>Here’s your profile information:</Text>
      {loggedInUser ? (
        <>
          <Text>Username: {loggedInUser}</Text> {/* Display the logged-in user's username */}
        </>
      ) : (
        <Text>Please log in to see your profile details.</Text>
      )}
    </View>
  );

  // Tab Navigator
  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Explore') iconName = 'compass';
          else if (route.name === 'Profile') iconName = 'account';
          return <IconButton icon={iconName} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} loggedInUser={loggedInUser} fullName={fullName} />}
      </Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginVertical: 8,
  },
  card: {
    marginBottom: 16,
    width: '90%',
  },
});
