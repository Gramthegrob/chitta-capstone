import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function MusicDetailScreen({ route, navigation }) {
const { track } = route.params;
const [sound, setSound] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
    // Bersihkan audio saat keluar halaman
    return () => {
    if (sound) {
        sound.unloadAsync();
    }
    };
}, [sound]);

const playPause = async () => {
    try {
    if (sound) {
        if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        } else {
        await sound.playAsync();
        setIsPlaying(true);
        }
    } else {
        const { sound: newSound } = await Audio.Sound.createAsync({
        uri: track.musicUrl,
        });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
    }
    } catch (error) {
    console.error("Error playing sound:", error);
    }
};

return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
    </TouchableOpacity>

    <Image
        source={{
        uri:
            track.imageUrl ??
            "https://via.placeholder.com/300x300.png?text=No+Image",
        }}
        style={styles.album}
    />

    <Text style={styles.name}>{track.title}</Text>
    <Text style={styles.artist}>Musik Relaksasi</Text>

    <TouchableOpacity style={styles.playBtn} onPress={playPause}>
        <Ionicons
        name={isPlaying ? "pause" : "play"}
        size={34}
        color="#FFF"
        />
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F3EFFF",
    paddingTop: 40,
},
back: {
    position: "absolute",
    top: 50,
    left: 20,
},
album: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginTop: 80,
    marginBottom: 30,
},
name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
artist: { fontSize: 16, color: "gray", marginBottom: 40 },
playBtn: {
    backgroundColor: "#6C63FF",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
},
});
