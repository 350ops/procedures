import { Stack } from "expo-router";

export default function FlightGameLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, orientation: "portrait" }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
