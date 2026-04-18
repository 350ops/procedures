import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function PfdGameLayout() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme === "dark" ? "white" : "black",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "PFD Challenge",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeStyle: { backgroundColor: "transparent" },
          headerBlurEffect:
            theme === "dark" ? "systemMaterialDark" : "systemMaterialLight",
        }}
      />
    </Stack>
  );
}
