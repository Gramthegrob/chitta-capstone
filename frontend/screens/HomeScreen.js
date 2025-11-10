import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../components/container";
import Card from "../components/card";

export default function HomeScreen() {
const navigation = useNavigation();
const [profileData, setProfileData] = useState({
    nama: "WARGA UNDIP", //pokoknya ini nanti buat nama user dari database
    foto: null,
});
const [greeting, setGreeting] = useState("");

useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
}, []);

return (
    <Container>
    {/* Header */}
    <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.navigate("Profile")}
    >
        <Image
        style={styles.avatar}
        source={
            profileData.foto
            ? { uri: profileData.foto }
            : require("../assets/person.png")
        }
        />
        <View>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.name}>{profileData.nama}</Text>
        </View>
    </TouchableOpacity>

    {/* Chat AI */}
    <Card
        title="Mulai Mengobrol dengan Chat AI"
        description="Asisten AI kami yang akan selalu menemanimu"
        type="info"
    >
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Konsultasi")}
        >
        <Text style={styles.buttonText}>Mengobrol dengan Chat AI</Text>
        </TouchableOpacity>
    </Card>

    {/* Kesadaran Penuh */}
    <TouchableOpacity
        onPress={() => navigation.navigate("Kesadaran Penuh")}
    >
        <Card
        title="Kesadaran Penuh"
        description="Ruang untuk kamu fokus, menulis jurnal, dan merasakan ketenangan"
        />
    </TouchableOpacity>

    {/* Pemantauan Tingkat Stres */}
    <TouchableOpacity
        onPress={() => navigation.navigate("Pemantauan Stres")}
    >
        <Card
        title="Pemantauan Tingkat Stres"
        description="Pantau level stres kamu setiap hari"
        />
    </TouchableOpacity>

    {/* Pelacakan Tidur */}
    <TouchableOpacity
        onPress={() => navigation.navigate("Pelacakan Tidur")}
    >
        <Card
        title="Pelacakan Tidur"
        description="Pantau durasi dan kualitas tidurmu"
        />
    </TouchableOpacity>

    {/* Pemantauan Mahasiswa */}
    <TouchableOpacity
        onPress={() => navigation.navigate("Pemantauan Mahasiswa")}
    >
        <Card
        title="Pemantauan Mahasiswa"
        description="Deteksi kesehatan mental (kecemasan, depresi, stres)"
        />
    </TouchableOpacity>

    {/* Info UPT */}
    <Card
        title="UPT LKDPDEM"
        description="[UPT Layanan Konsultasi, Disabilitas, Penegakan Disiplin, dan Etika Mahasiswa UNDIP]"
    >
        <Text style={styles.cardDesc}>Hotline: 0811-2500-5757</Text>
        <Text style={styles.cardDesc}>Email: upt.yanmas@undip.id</Text>
        <Text style={styles.cardDesc}>linktr.ee/undip.studentcare</Text>
    </Card>
    </Container>
);
}

const styles = StyleSheet.create({
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 35,
},
avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#fff",
},
greeting: {
    fontSize: 15,
    color: "#000",
},
name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
},
button: {
    backgroundColor: "#534DD9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
},
cardDesc: {
    fontSize: 13,
    color: "#000",
},
});
