"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import Container from "../components/container"
import Card from "../components/card"

const screenWidth = Dimensions.get("window").width

// === Data Dummy per jam ===
const dummyStressData = [
{
    date: "01 November 2025",
    hourly: [
    { hour: "08:00", stressed: false },
    { hour: "09:00", stressed: true },
    { hour: "10:00", stressed: false },
    { hour: "11:00", stressed: true },
    { hour: "12:00", stressed: false },
    ],
},
{
    date: "02 November 2025",
    hourly: [
    { hour: "08:00", stressed: false },
    { hour: "09:00", stressed: false },
    { hour: "10:00", stressed: true },
    ],
},
{
    date: "03 November 2025",
    hourly: [
    { hour: "08:00", stressed: true },
    { hour: "09:00", stressed: true },
    { hour: "10:00", stressed: false },
    ],
},
]

const getStatusDescription = (stressed) => (stressed ? "Stres" : "Relax")

export default function PemantauanStresScreen({ navigation }) {
const [selectedDate, setSelectedDate] = useState(dummyStressData[dummyStressData.length - 1]?.date)
const [selectedData, setSelectedData] = useState(dummyStressData[dummyStressData.length - 1] || null)
const scrollRef = useRef(null)
const dateScrollRef = useRef(null)

// Update selectedData saat tanggal berubah
useEffect(() => {
    const data = dummyStressData.find((d) => d.date === selectedDate)
    setSelectedData(data || null)
}, [selectedDate])

useEffect(() => {
    if (dateScrollRef.current) {
    setTimeout(() => {
        dateScrollRef.current.scrollToEnd({ animated: true })
    }, 100)
    }
}, [])

useEffect(() => {
    if (scrollRef.current && selectedData?.hourly?.length > 0) {
    setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true })
    }, 100)
    }
}, [selectedData])

return (
    <Container>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.dateContainer}>
        <ScrollView
            horizontal
            ref={dateScrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
        >
            {dummyStressData.map((item, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.dateButton, selectedDate === item.date && styles.dateButtonActive]}
                onPress={() => setSelectedDate(item.date)}
            >
                <Text style={[styles.dateText, selectedDate === item.date && styles.dateTextActive]}>
                {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                })}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
        </View>

        {selectedData && (
        <Card style={styles.graphCard} type="info">
            <Text style={styles.title}>Riwayat Stres {selectedDate}</Text>  
            <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.barRowContainer}
            >
            <View style={styles.barRow}>
                {selectedData.hourly.map((item, idx) => {
                const barHeight = item.stressed ? 70 : 40
                return (
                    <View key={idx} style={styles.barContainer}>
                    <Text style={styles.levelLabel}>{getStatusDescription(item.stressed)}</Text>
                    <View
                        style={[
                        styles.bar,
                        {
                            height: barHeight,
                            backgroundColor: item.stressed ? "#E74C3C" : "#2ECC71",
                        },
                        ]}
                    />
                    <Text style={styles.hourLabel}>{item.hour}</Text>
                    </View>
                )
                })}
            </View>
            </ScrollView>
        </Card>
        )}

        {selectedData?.hourly && (
        <Card>
            {selectedData.hourly.map((item, idx) => (
            <Text key={idx} style={styles.descText}>
                {item.hour}: {getStatusDescription(item.stressed)}{" "}
                {item.stressed
                ? "- Kamu sedang mengalami stres. Istirahat sejenak dan pertimbangkan berbicara dengan konselor."
                : "- Kondisimu baik! Pertahankan rutinitas positif."}
            </Text>
            ))}
        </Card>
        )}

        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Kesadaran Penuh")}>
            <Text style={styles.linkTitle}>Kesadaran Penuh {">"}</Text>
            <Text style={styles.linkDesc}>Ruang untuk kamu fokus, menulis jurnal, dan merasakan ketenangan.</Text>
        </TouchableOpacity>
        </Card>

        <Card style={styles.linkCard}>
        <TouchableOpacity onPress={() => navigation.navigate("Tips Stres")}>
            <Text style={styles.linkTitle}>Tips Mengatasi Stres {">"}</Text>
            <Text style={styles.linkDesc}>Dapatkan tips dan saran untuk mengelola stres dengan lebih baik.</Text>
        </TouchableOpacity>
        </Card>
    </ScrollView>
    </Container>
)
}

const styles = StyleSheet.create({
dateContainer: {
    marginBottom: 15,
    paddingHorizontal: 0,
},
dateScrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
},
dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#E9E8FF",
},
dateButtonActive: { backgroundColor: "#534DD9" },
dateText: { color: "#041062", fontWeight: "500", fontSize: 12 },
dateTextActive: { color: "#fff", fontWeight: "600" },
graphCard: { paddingVertical: 20, marginBottom: 20 },
title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 15,
    textAlign: "center",
},
barRowContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
},
barRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 10,
},
barContainer: { alignItems: "center", marginHorizontal: 8 },
levelLabel: {
    fontSize: 10,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "500",
},
hourLabel: {
    fontSize: 10,
    color: "#041062",
    marginTop: 4,
    fontWeight: "600",
},
bar: { width: 24, borderRadius: 5, marginBottom: 4 },
descText: { fontSize: 13, color: "#555", marginBottom: 8, lineHeight: 18 },
linkCard: { marginBottom: 15 },
linkTitle: { fontSize: 16, fontWeight: "600", color: "#041062" },
linkDesc: { fontSize: 13, color: "#555", marginTop: 4, lineHeight: 18 },
})
