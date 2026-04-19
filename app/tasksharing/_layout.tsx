import { Stack } from "expo-router";

export default function TaskSharingLayout() {
  return (
    <Stack
      screenOptions={{
        orientation: "portrait",
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="browse"
        options={{
          headerShown: true,
          title: "Browse",
          headerBackTitle: "Phases",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#000" },
        }}
      />
      <Stack.Screen
        name="practice"
        options={{
          headerShown: true,
          title: "Practice",
          headerBackTitle: "Phases",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#000" },
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}
