import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../auth/auth-context";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    try {
      setLoading(true);

      await login(username, password);

      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 justify-center bg-white/80 px-6">
        <Text className="mb-10 text-center text-4xl font-bold text-gray-900">
          Login
        </Text>

        <TextInput
          className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          className="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          className={`items-center rounded-lg px-4 py-3 ${
            loading ? "bg-gray-950" : "bg-black"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-base font-semibold text-white">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <View className="mt-5 w-full items-center">
          <Link
            href="/auth/register"
            className="text-blue-600"
          >
            Don't have an account? Register
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}