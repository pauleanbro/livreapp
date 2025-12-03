import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { SplashVideo } from './SplashVideo';

type AnimatedSplashScreenProps = {
  children: React.ReactNode;
};

function AnimatedSplashScreen({ children }: AnimatedSplashScreenProps) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady && isSplashVideoComplete) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [animation, isAppReady, isSplashVideoComplete]);

  const onVideoFinish = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } finally {
      setSplashVideoComplete(true);
      setAppReady(true);
    }
  }, []);

  const videoElement = <SplashVideo onFinish={onVideoFinish} />;

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: '#FFF', opacity: animation }]}>
          {videoElement}
        </Animated.View>
      )}
    </View>
  );
}

export default AnimatedSplashScreen;
