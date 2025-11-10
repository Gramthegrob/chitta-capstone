import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Container from "../components/container";
import Card from "../components/card";

const ProfileScreen = ({ navigation, setIsLoggedIn }) => {
const [profileData] = useState({
    nama: "Warga Undip",
    nim: "21120122140xxx",
    jurusan: "Teknik Komputer",
    fakultas: "Teknik",
    semester: "7",
    jenisKelamin: "-",
    foto: null,
});

return (
    <Container>
    <Card 
    type="info">
        <View style={styles.profileContainer}>
        <Image
            style={styles.profileImage}
            source={
            profileData.foto
                ? { uri: profileData.foto }
                : require("../assets/person.png")
            }
        />
        </View>

        <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{profileData.nama}</Text>

        <Text style={styles.label}>NIM</Text>
        <Text style={styles.value}>{profileData.nim}</Text>

        <Text style={styles.label}>Jurusan</Text>
        <Text style={styles.value}>{profileData.jurusan}</Text>

        <Text style={styles.label}>Fakultas</Text>
        <Text style={styles.value}>{profileData.fakultas}</Text>

        <Text style={styles.label}>Semester</Text>
        <Text style={styles.value}>{profileData.semester}</Text>

        <Text style={styles.label}>Jenis Kelamin</Text>
        <Text style={styles.value}>{profileData.jenisKelamin}</Text>
        </View>

        <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setIsLoggedIn(false)}
        >
        <Text style={styles.logoutText}>→ Logout</Text>
        </TouchableOpacity>
    </Card>
    </Container>
);
};

const styles = StyleSheet.create({
profileContainer: { alignItems: "center", marginBottom: 20 },
profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#007AFF",
    borderWidth: 1,
    backgroundColor: "#",
},
infoContainer: { marginBottom: 20 },
label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
value: { fontSize: 16, marginBottom: 10, color: "#000" },
logoutButton: { alignItems: "flex-end" },
logoutText: { fontSize: 16, color: "#007AFF" },
});

export default ProfileScreen;
