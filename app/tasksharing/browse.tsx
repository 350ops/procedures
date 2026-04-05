import { useLocalSearchParams, Stack } from "expo-router";
import BrowseScreen from "@/components/tasksharing/BrowseScreen";
import { flightPhases } from "@/data/tasksharing";

export default function BrowseRoute() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const phase = flightPhases.find((p) => p.id === phaseId);

  return (
    <>
      <Stack.Screen options={{ title: phase?.name ?? "Browse" }} />
      <BrowseScreen phaseId={phaseId ?? flightPhases[0].id} />
    </>
  );
}
