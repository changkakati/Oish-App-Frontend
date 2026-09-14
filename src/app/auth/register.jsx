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

export default function Register() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      await register(username, email, password);

      // Automatically login after registration
      await login(username, password);

      // Go to onboarding
      router.replace("/onboarding");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      Alert.alert(
        "Registration/Login failed",
        error.message
      );
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
          Create Account
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
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-base font-semibold text-white">
            {loading ? "Creating account..." : "Register"}
          </Text>
        </Pressable>

        <View className="mt-5 w-full items-center">
          <Link
            href="/auth/login"
            className="text-blue-600"
          >
            Already have an account? Login
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}