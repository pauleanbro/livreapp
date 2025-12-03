import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEvent, useEventListener } from 'expo';
import {
  useVideoPlayer,
  VideoView,
  type PlayingChangeEventPayload,
  type SourceLoadEventPayload,
  type VideoPlayerEvents,
} from 'expo-video';

type SplashVideoProps = {
  onFinish: () => void;
};

export function SplashVideo({ onFinish }: SplashVideoProps) {
  const videoSource = require('@/assets/splash.mp4');
  const playbackRate = 0.8;

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = false;
    p.playbackRate = playbackRate;
    p.play();
  });

  const [hasEnded, setHasEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  useEventListener(player, 'playToEnd', () => setHasEnded(true));

  useEventListener(player, 'sourceLoad', ({ duration }: SourceLoadEventPayload) => {
    setDurationMs(Math.max(0, duration * 1000));
  });

  const playingEvent = useEvent<VideoPlayerEvents, 'playingChange', VideoPlayerEvents['playingChange'], PlayingChangeEventPayload>(
    player,
    'playingChange',
    { isPlaying: player.playing, oldIsPlaying: undefined },
  );
  const isPlaying = playingEvent?.isPlaying ?? false;

  useEffect(() => {
    if (isPlaying) setHasStarted(true);
  }, [isPlaying]);

  useEffect(() => {
    if (!hasStarted) return;
    const baseMs = durationMs ?? 5000; // fallback if metadata not ready
    const targetMs = baseMs / playbackRate;
    const timer = setTimeout(() => setMinTimePassed(true), targetMs);
    return () => clearTimeout(timer);
  }, [durationMs, hasStarted, playbackRate]);

  useEffect(() => {
    if (hasEnded && minTimePassed) onFinish();
  }, [hasEnded, minTimePassed, onFinish]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        contentFit="contain"
        showsTimecodes={false}
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
        player={player}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 64,
  },
  video: {
    flex: 1,
  },
});
