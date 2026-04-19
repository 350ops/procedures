import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function TaskSharingLayout() {
  const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme === "dark" ? "white" : "black",
        orientation: "portrait",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "A350 procedures",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: { backgroundColor: "transparent" },
          headerBlurEffect:
            theme === "dark" ? "systemMaterialDark" : "systemMaterialLight",
        }}
      />
      <Stack.Screen
        name="browse"
        options={{
          title: "Browse",
          headerBackTitle: "Phases",
        }}
      />
      <Stack.Screen
        name="practice"
        options={{
          title: "Practice",
          headerBackTitle: "Phases",
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          title: "Quiz",
          headerBackTitle: "Phases",
        }}
      />
    </Stack>
  );
}
