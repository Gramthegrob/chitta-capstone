import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import { rekomendasiDASS } from "../../data/rekomendasiDASS";

const screenWidth = Dimensions.get("window").width - 30;
const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
};

export default function HasilPemantauanScreen() {
const route = useRoute();
const { data } = route.params || {
    data: { tanggal: "17/11", Depresi: 2, Kecemasan: 1, Stres: 3 },
};

const barData = {
    labels: ["Depresi", "Kecemasan", "Stres"],
    datasets: [
    { data: [data.Depresi, data.Kecemasan, data.Stres] },
    ],
};

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
    <View style={styles.card}>
        <Text style={styles.title}>Hasil Pemantauan</Text>
        <Text style={styles.subtitle}>Tanggal: {data.tanggal}</Text>

        <BarChart
        data={barData}
        width={screenWidth}
        height={220}
        fromZero
        yAxisInterval={1}
        chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(83, 77, 217, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ borderRadius: 10 }}
        />
        <Text style={styles.levelNote}>
        1 = Ringan | 2 = Sedang | 3 = Berat | 4 = Sangat Berat
        </Text>
    </View>

    {["Depresi", "Kecemasan", "Stres"].map((domain) => {
        const level = data[domain];
        const kategori = levelKeterangan[level];
        const rekom = rekomendasiDASS[domain][kategori];
        return (
        <View key={domain} style={styles.section}>
            <Text style={styles.sectionTitle}>{domain}</Text>
            <Text style={styles.kategori}>Kategori: {kategori}</Text>
            <Text style={styles.label}>Gejala:</Text>
            <Text style={styles.text}>{rekom.gejala}</Text>
            <Text style={styles.label}>Rekomendasi:</Text>
            <Text style={styles.text}>{rekom.rekomendasi}</Text>
        </View>
        );
    })}
    <View style={styles.section}>
        <Text style={styles.text}>
            "Kehidupan yang baik adalah sebuah proses, bukan suatu keadaan yang ada dengan sendirinya. Kehidupan itu sendiri adalah arah, bukan tujuan."
        </Text>
        <Text style={styles.author}>- Carl Rogers</Text>
    </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#F3EFFF" },
scrollContainer: { padding: 15, paddingBottom: 40 },
card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
},
title: { fontSize: 18, fontWeight: "bold", color: "#041062" },
subtitle: { fontSize: 14, color: "#666", marginBottom: 10 },
levelNote: { marginTop: 8, fontSize: 12, color: "#666" },
section: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
},
sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#041062" },
kategori: { fontWeight: "600", marginVertical: 5 },
label: { fontWeight: "bold", marginTop: 8 },
text: { fontSize: 14, color: "#333", marginBottom: 4 },
});


//ini ada salah di bagian graph nya. sering tbtb intervalnya ada yg double ga 1,2,3,4 tapi malah 1,2,2,3 atau 1,2,3,3