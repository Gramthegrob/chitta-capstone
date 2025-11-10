import React, { useState, useMemo, useRef, useEffect } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Container from "../components/container";
import Card from "../components/card";

const screenWidth = Dimensions.get("window").width - 30;

// === Data Dummy (simulasi dari Juli 2024) ===
const riwayatPerBulan = {
"Januari 2024": [
    { tanggal: "15/7", Depresi: 1, Kecemasan: 2, Stres: 1 },
    { tanggal: "22/7", Depresi: 2, Kecemasan: 3, Stres: 2 },
],
"Agustus 2024": [],
"September 2024": [
    { tanggal: "10/9", Depresi: 2, Kecemasan: 3, Stres: 1 },
    { tanggal: "12/9", Depresi: 1, Kecemasan: 2, Stres: 2 },
],
"Oktober 2024": [
    { tanggal: "01/10", Depresi: 2, Kecemasan: 2, Stres: 1 },
    { tanggal: "08/10", Depresi: 3, Kecemasan: 3, Stres: 2 },
    { tanggal: "15/10", Depresi: 1, Kecemasan: 2, Stres: 3 },
],
"November 2025": [
    { tanggal: "01/10", Depresi: 4, Kecemasan: 2, Stres: 4 },
    { tanggal: "08/10", Depresi: 4, Kecemasan: 3, Stres: 3 },
    { tanggal: "15/10", Depresi: 4, Kecemasan: 4, Stres: 4 },
], 
};

const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
};

// === Fungsi bantu: generate bulan dari data pertama ke bulan sekarang ===
const generateMonthListFromData = (riwayatData) => {
const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

const allKeys = Object.keys(riwayatData);
if (allKeys.length === 0) return [];

// ambil bulan & tahun paling awal dari data
const firstKey = allKeys[0];
const [firstMonthName, firstYear] = firstKey.split(" ");
const startMonth = monthNames.indexOf(firstMonthName) + 1;
const startYear = parseInt(firstYear);

const now = new Date();
const currentMonth = now.getMonth(); // 0-based
const currentYear = now.getFullYear();

const list = [];
let month = startMonth - 1;
let year = startYear;

while (year < currentYear || (year === currentYear && month <= currentMonth)) {
    list.push(`${monthNames[month]} ${year}`);
    month++;
    if (month > 11) {
    month = 0;
    year++;
    }
}
return list;
};

export default function RiwayatPemantauanScreen({ navigation }) {
const monthList = useMemo(() => generateMonthListFromData(riwayatPerBulan), []);
const [selectedMonth, setSelectedMonth] = useState(
    monthList[monthList.length - 1]
);

const scrollRef = useRef(null);

useEffect(() => {
    // auto scroll ke kanan (bulan sekarang)
    setTimeout(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
    }
    }, 300);
}, []);

const dataBulanIni = riwayatPerBulan[selectedMonth] || [];
const chartData = {
    labels: dataBulanIni.map((d) => d.tanggal),
    datasets: [
    { data: dataBulanIni.map((d) => d.Depresi), color: () => "#FF6384" },
    { data: dataBulanIni.map((d) => d.Kecemasan), color: () => "#36A2EB" },
    { data: dataBulanIni.map((d) => d.Stres), color: () => "#FFCE56" },
    ],
    legend: ["Depresi", "Kecemasan", "Stres"],
};

const isEmpty = dataBulanIni.length === 0;

return (
    <Container>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Isi Pemantauan")}
        >
        <Text style={styles.buttonText}>Lakukan Pemantauan</Text>
        </TouchableOpacity>

        {/* === Scroll Bulan === */}
        <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthSelector}
        >
        {monthList.map((bulan) => (
            <TouchableOpacity
            key={bulan}
            style={[
                styles.monthButton,
                selectedMonth === bulan && styles.monthButtonActive,
            ]}
            onPress={() => setSelectedMonth(bulan)}
            >
            <Text
                style={[
                styles.monthText,
                selectedMonth === bulan && styles.monthTextActive,
                ]}
            >
                {bulan}
            </Text>
            </TouchableOpacity>
        ))}
        </ScrollView>

        {/* === Grafik === */}
        <Card title={`Grafik Pemantauan ${selectedMonth}`} type="info">
        {isEmpty ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                Belum melakukan pemantauan pada bulan ini.
            </Text>
            </View>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
                style={{ width: Math.max(screenWidth, dataBulanIni.length * 100) }}
            >
                <LineChart
                data={chartData}
                width={Math.max(screenWidth, dataBulanIni.length * 100)}
                height={230}
                fromZero
                yAxisInterval={1}
                yLabelsOffset={10}
                chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(4, 16, 98, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
                }}
                bezier
                style={{ borderRadius: 10 }}
                segments={4}
                yAxisMin={1}
                yAxisMax={4}
                />
                <Text style={styles.levelNote}>
                1 = Ringan | 2 = Sedang | 3 = Berat | 4 = Sangat Berat
                </Text>
            </View>
            </ScrollView>
        )}
        </Card>

        {/* === Keterangan === */}
        <Card title="Keterangan">
        <Text style={styles.text}>
            <Text style={styles.bold}>Ringan:</Text> Gejala ringan, dapat diatasi
            dengan relaksasi.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Sedang:</Text> Mulai mengganggu aktivitas,
            disarankan konsultasi.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Berat:</Text> Gejala intens, perlu dukungan
            profesional.
        </Text>
        <Text style={styles.text}>
            <Text style={styles.bold}>Sangat Berat:</Text> Gangguan fungsi harian,
            butuh psikiater.
        </Text>
        </Card>

        {/* === Riwayat === */}
        <Card title={`Riwayat Pemantauan ${selectedMonth}`}>
        {isEmpty ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                Belum melakukan pemantauan pada bulan ini.
            </Text>
            </View>
        ) : (
            dataBulanIni.map((item, index) => (
            <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() =>
                navigation.navigate("Hasil Pemantauan", { data: item })
                }
            >
                <Text style={styles.historyDate}>Tanggal: {item.tanggal}</Text>
                <Text style={styles.historyText}>
                Depresi: {levelKeterangan[item.Depresi]} | Kecemasan:{" "}
                {levelKeterangan[item.Kecemasan]} | Stres:{" "}
                {levelKeterangan[item.Stres]}
                </Text>
            </TouchableOpacity>
            ))
        )}
        </Card>
    </ScrollView>
    </Container>
);
}

const styles = StyleSheet.create({
scrollContainer: {
    paddingBottom: 30,
},
button: {
    backgroundColor: "#041062",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
// === Selector Bulan ===
monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
},
monthButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
},
monthButtonActive: {
    backgroundColor: "#534DD9",
},
monthText: {
    color: "#041062",
    fontSize: 14,
    fontWeight: "500",
},
monthTextActive: {
    color: "#fff",
    fontWeight: "bold",
},
// === Grafik ===
emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
},
emptyText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
},
levelNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginTop: 8,
},
// === Keterangan ===
text: {
    color: "#333",
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
},
bold: {
    fontWeight: "bold",
    color: "#041062",
},
// === Riwayat ===
historyItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0FF",
},
historyDate: {
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 4,
},
historyText: {
    color: "#333",
    fontSize: 13,
},
});
