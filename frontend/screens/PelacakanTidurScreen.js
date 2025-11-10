import React, { useEffect, useState, useRef } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
ActivityIndicator,
} from "react-native";
import Container from "../components/container";
import Card from "../components/card";

export default function PelacakanTidurScreen({ navigation }) {
const [sleepData, setSleepData] = useState(null);
const [selectedData, setSelectedData] = useState(null);
const [loading, setLoading] = useState(true);
const scrollViewRef = useRef(null);

useEffect(() => {
    setTimeout(() => {
    const dummy = {
        chart: [
        { date: "30/10", hours: 5.2, start: "23:30", end: "04:45" },
        { date: "31/10", hours: 6.5, start: "22:45", end: "05:15" },
        { date: "01/11", hours: 7.1, start: "22:00", end: "05:05" },
        { date: "02/11", hours: 6.8, start: "23:00", end: "05:50" },
        { date: "03/11", hours: 15.5, start: "00:10", end: "05:40" },
        { date: "04/11", hours: 1.0, start: "21:45", end: "05:45" },
        { date: "05/11", hours: 6.7, start: "22:10", end: "04:50" },
        { date: "06/11", hours: 7.4, start: "22:00", end: "05:30" },
        { date: "07/11", hours: 5.9, start: "23:20", end: "05:10" },
        { date: "08/11", hours: 6.3, start: "22:15", end: "04:45" },
        ],
    };
    setSleepData(dummy);
    if (dummy.chart.length > 0) {
        setSelectedData(dummy.chart[dummy.chart.length - 1]);
    }
    setLoading(false);
    }, 1000);
}, []);

useEffect(() => {
    if (sleepData && sleepData.chart.length > 0 && scrollViewRef.current) {
    setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
    }, 200);
    }
}, [sleepData]);

if (loading) {
    return (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="#534DD9" />
    </View>
    );
}

if (!sleepData) {
    return (
    <View style={styles.center}>
        <Text style={styles.noDataText}>Data belum tersedia</Text>
    </View>
    );
}

const formatFullDate = (dateStr) => {
    const [day, month] = dateStr.split("/");
    const months = [
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
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} 2025`;
};

const getSleepMessage = (hours) => {
    if (hours < 6) return "Rentang waktu tidur kurang dari yang disarankan.";
    if (hours >= 6 && hours <= 8)
    return "Tidur Anda berada pada rentang yang disarankan.";
    return "Tidur Anda berlebihan, coba kurangi sedikit.";
};

const sleepMessage = selectedData
    ? getSleepMessage(selectedData.hours)
    : "Belum ada data untuk ditampilkan.";

return (
    <Container>
    {/* Grafik Tidur */}
    <Card title="Grafik Pelacakan Tidur" type="info">
        <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={[
            styles.chartScroll,
            { width: sleepData.chart.length * 55 },
        ]}
        >
        {sleepData.chart.map((item, idx) => (
            <TouchableOpacity
            key={idx}
            style={styles.barContainer}
            onPress={() => setSelectedData(item)}
            activeOpacity={0.7}
            >
            <View
                style={[
                styles.bar,
                {
                    height: item.hours * 10,
                    backgroundColor:
                    selectedData?.date === item.date ? "#041062" : "#534DD9",
                },
                ]}
            />
            <Text style={styles.barLabel}>{item.date}</Text>
            <Text style={styles.barHours}>{item.hours.toFixed(1)}j</Text>
            </TouchableOpacity>
        ))}
        </ScrollView>
    </Card>

    {/* Durasi Tidur */}
    <Card title={`Durasi Tidur (${formatFullDate(selectedData.date)})`}>
        <Text style={styles.duration}>{selectedData.hours.toFixed(1)} jam</Text>
        <Text style={styles.subText}>
        {selectedData.start} - {selectedData.end}
        </Text>
        <Text style={styles.subText}>{sleepMessage}</Text>
    </Card>

    {/* Tips Tidur */}
    <Card title="Tips Meningkatkan Kualitas Tidur">
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Tips Tidur")}
        >
        <Text style={styles.buttonText}>Lihat Tips</Text>
        </TouchableOpacity>
    </Card>
    </Container>
);
}

const styles = StyleSheet.create({
center: { flex: 1, justifyContent: "center", alignItems: "center" },
noDataText: { fontSize: 14, color: "#777", textAlign: "center", marginTop: 12 },
chartScroll: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 90,
},
barContainer: { alignItems: "center", marginHorizontal: 6, width: 45 },
bar: { width: 30, marginVertical: 4, borderRadius: 6 },
barLabel: { fontSize: 12, color: "#333", marginTop: 4 },
barHours: { fontSize: 11, color: "#777" },
duration: { fontSize: 28, fontWeight: "700", color: "#041062" },
subText: { fontSize: 14, color: "#555", marginTop: 4 },
button: {
    marginTop: 12,
    backgroundColor: "#534DD9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
},
buttonText: { color: "#fff", fontWeight: "600" },
});
