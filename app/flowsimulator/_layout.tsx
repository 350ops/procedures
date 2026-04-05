import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function FlowSimulatorLayout() {
  const rawTheme = useColorScheme();
  const theme = rawTheme === "dark" ? "dark" : "light";

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme === "dark" ? "white" : "black",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Flow Simulator",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: { backgroundColor: "transparent" },
          headerBlurEffect:
            theme === "dark" ? "systemMaterialDark" : "systemMaterialLight",
        }}
      />
      <Stack.Screen
        name="viewer"
        options={{
          title: "Viewer",
          headerBackTitle: "Topics",
        }}
      />
      <Stack.Screen
        name="practice"
        options={{
          title: "Practice",
          headerBackTitle: "Topics",
        }}
      />
    </Stack>
  );
}
