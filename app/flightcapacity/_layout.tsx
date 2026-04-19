import { Stack } from "expo-router";

export default function FlightCapacityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        orientation: "landscape",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
