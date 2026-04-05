import { useLocalSearchParams, Stack } from "expo-router";
import FlowViewerScreen from "@/components/flowsimulator/FlowViewerScreen";
import { getTopicById } from "@/data/flowsimulator";

export default function ViewerRoute() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const topic = getTopicById(topicId ?? "");

  return (
    <>
      <Stack.Screen options={{ title: topic?.name ?? "Viewer" }} />
      <FlowViewerScreen topicId={topicId ?? "cockpit-overview"} />
    </>
  );
}
