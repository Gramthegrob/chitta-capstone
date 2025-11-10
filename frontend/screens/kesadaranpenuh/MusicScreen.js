import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import Container from "../../components/container";
import Card from "../../components/card";

export default function MusicScreen({ navigation }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch("http://192.168.1.5:5000/api/music");
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Gagal memuat musik:", error);
      } finally {
        setTimeout(() => setLoading(false), 1000); 
      }
    };

    fetchMusic();
  }, []);

  if (loading) {
    return (
      <Container>
        <Text style={styles.title}>Musik Relaksasi</Text>
        <SkeletonList />
      </Container>
    );
  }

  return (
    <Container>
      <Text style={styles.title}>Musik Relaksasi</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("MusicDetail", { track: item })}
          >
            <Card>
              <View style={styles.row}>
                <Image
                  source={{
                    uri:
                      item.imageUrl ??
                      "https://via.placeholder.com/150x150.png?text=No+Image",
                  }}
                  style={styles.image}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.artist}>Musik Relaksasi</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}

/* 🎨 Skeleton Loading Component */
const SkeletonList = () => {
  const fadeAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const placeholders = Array(5).fill(0);

  return (
    <View>
      {placeholders.map((_, index) => (
        <Card key={index}>
          <Animated.View style={[styles.row, { opacity: fadeAnim }]}>
            <View style={styles.skeletonImage} />
            <View style={{ flex: 1 }}>
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonLine} />
            </View>
          </Animated.View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#041062",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  artist: {
    fontSize: 14,
    color: "gray",
  },
  // Skeleton (wireframe) styles
  skeletonImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  skeletonLineShort: {
    width: "60%",
    height: 14,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonLine: {
    width: "40%",
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
});
