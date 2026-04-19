import * as Haptics from "expo-haptics";

// Audio cues for the Flight Capacity Test.
// Spec reference: /Users/m/procedures-1/components/flightgame/flightcapacity/audio.md
// When real audio files are wired in, swap console.log for an expo-av Sound.play().
export type AudioCue =
  | "traffic_traffic"
  | "master_caution"
  | "master_warning";

type Listener = (cue: AudioCue) => void;

const listeners = new Set<Listener>();

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function play(cue: AudioCue) {
  if (cue === "traffic_traffic" || cue === "master_warning") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
      () => {}
    );
  }
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[flightcapacity audio] ${cue}`);
  }
  for (const l of listeners) l(cue);
}
