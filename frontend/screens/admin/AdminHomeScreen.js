"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Container from "../../components/container"
import Card from "../../components/card"

export default function AdminHomeScreen() {
const navigation = useNavigation()
const [profileData, setProfileData] = useState({
    nama: "Admin Undip", // Dari database
})
const [greeting, setGreeting] = useState("")

useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi")
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang")
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore")
    else setGreeting("Selamat Malam")
}, [])

return (
    <Container>
    {/* Header */}
    <TouchableOpacity style={styles.header} onPress={() => navigation.navigate("Profile Admin")}>
        <View>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.name}>{profileData.nama}</Text>
        </View>
    </TouchableOpacity>

    {/* Daftar Mahasiswa */}
    <TouchableOpacity onPress={() => navigation.navigate("Daftar Mahasiswa")}>
        <Card title="Daftar Mahasiswa" description="Lihat data lengkap semua mahasiswa dan detail monitoring mereka" />
    </TouchableOpacity>

    {/* Riwayat Pemantauan Mahasiswa */}
    <TouchableOpacity onPress={() => navigation.navigate("Riwayat Pemantauan")}>
        <Card
        title="Riwayat Pemantauan Mahasiswa"
        description="Cek riwayat pemantauan kesehatan mental seluruh mahasiswa"
        />
    </TouchableOpacity>
    </Container>
)
}

const styles = StyleSheet.create({
header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 35,
},
greeting: {
    fontSize: 15,
    color: "#666",
},
name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
},
})
