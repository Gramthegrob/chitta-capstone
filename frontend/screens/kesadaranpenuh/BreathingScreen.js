import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BreathingScreen() {
  const TOTAL_TIME = 60;
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState("BERNAPAS");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const inhaleDuration = 4000; // 4 detik
  const exhaleDuration = 4000; // 4 detik
  const cycleDuration = inhaleDuration + exhaleDuration;

  const totalCycles = Math.floor(TOTAL_TIME * 1000 / cycleDuration);

  const animateBreathing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: inhaleDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: exhaleDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: totalCycles }
    ).start();
  };

  // Timer & fase
  useEffect(() => {
    let timer;
    let lastPhase = phase;

    if (isPlaying) {
      animateBreathing();

      timer = setInterval(() => {
        setTimeLeft((t) => {
          const newTime = t - 1;

          // Update fase nafas
          const cycleTime = (TOTAL_TIME - newTime) * 1000;
          const phaseInCycle = cycleTime % cycleDuration;
          const newPhase = phaseInCycle < inhaleDuration ? "Tarik Nafas" : "Buang Nafas";

          // Jika fase berubah, geter hp
          if (newPhase !== lastPhase) {
            Vibration.vibrate(200); // geter 200ms
            lastPhase = newPhase;
          }

          setPhase(newPhase);

          if (newTime <= 0) {
            setIsPlaying(false);
            setPhase("BERNAPAS");
            clearInterval(timer);
            scaleAnim.setValue(1);
          }

          return newTime;
        });
      }, 1000);
    } else {
      scaleAnim.setValue(1);
    }

    return () => clearInterval(timer);
  }, [isPlaying]);

  const resetBreathing = () => {
    setTimeLeft(TOTAL_TIME);
    setPhase("BERNAPAS");
    scaleAnim.setValue(1);
    setIsPlaying(false);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.phase}>{phase}</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

        <View style={styles.buttonsContainer}>
          {!isPlaying && timeLeft > 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsPlaying(true)}
            >
              <Ionicons name="play-circle" size={64} color="#041062" />
              <Text style={styles.buttonText}>Lanjut</Text>
            </TouchableOpacity>
          )}
          {!isPlaying && (
            <TouchableOpacity style={styles.button} onPress={resetBreathing}>
              <Ionicons name="refresh-circle" size={64} color="#041062" />
              <Text style={styles.buttonText}>Ulang</Text>
            </TouchableOpacity>
          )}
        </View>

        {isPlaying && (
          <TouchableOpacity style={styles.button} onPress={() => setIsPlaying(false)}>
            <Ionicons name="pause-circle" size={64} color="#041062" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFECFE",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(160, 185, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    padding: 10,
  },
  phase: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 8,
  },
  timer: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 12,
    color: "#041062",
    marginTop: 4,
  },
});
