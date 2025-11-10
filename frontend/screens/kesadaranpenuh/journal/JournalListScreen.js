import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import Container from "../../../components/container";
import Card from "../../../components/card";

export default function JournalListScreen({ navigation }) {
  const [journals, setJournals] = useState([

    {
      id: "1",
      title: "Jurnal Hari Ini",
      date: "3 Januari 2025",
      image: "https://i.pinimg.com/736x/f2/53/f5/f253f579b60285e77d5b444f423ddcc3.jpg",
      content: "Lorem ipsum dolor sit amet...",
    },
  ]);

  const addJournal = (newJournal) => {
    setJournals([newJournal, ...journals]);
  };

  return (
    <Container>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddEditJournal", { onSave: addJournal })}
        >
          <Text style={styles.addText}>+ Tambah Jurnal</Text>
        </TouchableOpacity>

      <Text style={styles.sectionTitle}>Jurnal Harian</Text>

      {journals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada jurnal.</Text>
        </View>
      ) : (
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("JournalDetail", { journal: item, onUpdate: setJournals })
              }
            >
              <Card>
                <View style={styles.cardRow}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text numberOfLines={1} style={styles.preview}>
                      {item.content}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#534DD9",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",

  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 10,
    marginTop: 10,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  textContainer: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 14 },
  date: { color: "#777", fontSize: 12 },
  preview: { color: "#555", fontSize: 12 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    color: "#777",
    fontStyle: "italic",
    fontSize: 16,
  },
});
