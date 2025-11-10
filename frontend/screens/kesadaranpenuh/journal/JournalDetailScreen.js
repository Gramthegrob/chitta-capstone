import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import Container from "../../../components/container";
import Card from "../../../components/card";

export default function JournalDetailScreen({ route, navigation }) {
  const { journal, onUpdate } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Container>
      <Card title={journal.title}>
        {/* Gambar thumbnail (bisa diklik) */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: journal.image }} style={styles.image} />
        </TouchableOpacity>

        <Text style={styles.date}>{journal.date}</Text>
        <Text style={styles.content}>{journal.content}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("AddEditJournal", {
              journal,
              onSave: (updatedJournal) => {
                onUpdate((prev) =>
                  prev.map((j) =>
                    j.id === updatedJournal.id ? updatedJournal : j
                  )
                );
                navigation.goBack();
              },
            })
          }
        >
          <Text style={styles.editText}>Edit Jurnal</Text>
        </TouchableOpacity>
      </Card>

      {/* Modal untuk tampilan gambar fullscreen */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <Image
            source={{ uri: journal.image }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
  },
  date: {
    color: "#777",
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#041062",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  editText: { color: "#fff", fontWeight: "bold" },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
