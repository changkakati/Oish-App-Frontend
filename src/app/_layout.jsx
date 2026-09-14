import "../../global.css";

import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AuthProvider } from "../auth/auth-context";

function AppShell() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-100">
      <StatusBar style="dark" />

      <View style={{ height: insets.top }} className="bg-white" />

      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </SafeAreaProvider>
  );
}