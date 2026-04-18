import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tasksharing" />
      <Stack.Screen name="flightgame" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
