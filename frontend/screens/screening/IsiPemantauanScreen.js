import React, { useState, useEffect } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
StyleSheet,
ActivityIndicator,
Alert,
} from "react-native";

const options = ["TS", "AS", "S", "SS"];

export default function IsiPemantauanScreen() {
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);

// Ganti sesuai endpoint server-mu (misal localhost:8000 atau domain deploy)
const API_BASE_URL = "http://10.0.2.2:8000/api"; // untuk emulator Android
// kalau pakai HP fisik: ganti ke IP laptop kamu (misal "http://192.168.1.7:8000/api")

useEffect(() => {
    // contoh dummy fetch pertanyaan (sementara kalau belum ada endpoint khusus)
    // nanti bisa diganti GET /screening/questions
    const dummyQuestions = [
    { code: "G01", text: "Saya merasa sedih tanpa alasan jelas." },
    { code: "G02", text: "Saya sulit merasa rileks." },
    { code: "G03", text: "Saya mudah cemas terhadap hal kecil." },
    { code: "G04", text: "Saya kehilangan minat terhadap hal-hal yang dulu menyenangkan." },
    ];
    setQuestions(dummyQuestions);
}, []);

const handleSelect = (code, option) => {
    setAnswers({ ...answers, [code]: option });
};

const handleSubmit = async () => {
    // pastikan semua pertanyaan terjawab
    if (Object.keys(answers).length < questions.length) {
    Alert.alert("Peringatan", "Silakan jawab semua pertanyaan terlebih dahulu.");
    return;
    }

    setLoading(true);
    try {
    const response = await fetch(`${API_BASE_URL}/screening`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ jawaban: answers }),
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Gagal memproses data");
    }

    const data = await response.json();
    setResult(data);
    } catch (error) {
    Alert.alert("Terjadi Kesalahan", error.message);
    } finally {
    setLoading(false);
    }
};

return (
    <ScrollView style={styles.container}>

    <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bagaimana Perasaan Anda Selama Satu Minggu Terakhir?</Text>
        <Text style={styles.infoText}>
        Di bawah ini terdapat beberapa pernyataan yang menggambarkan berbagai perasaan dan pengalaman.
        {"\n\n"}Silakan pilih jawaban yang paling mencerminkan keadaan Anda selama satu minggu terakhir.
        {"\n\n"}Tidak ada jawaban yang benar atau salah, yang terpenting adalah kejujuran Anda.
        </Text>
        <Text style={styles.infoText}>
        Gunakan skala berikut untuk menjawab:
        {"\n"}- TS = Tidak Sesuai
        {"\n"}- AS = Agak Sesuai
        {"\n"}- S = Sesuai
        {"\n"}- SS = Sangat Sesuai
        </Text>
    </View>

    {questions.map((q) => (
        <View key={q.code} style={styles.questionBox}>
        <Text style={styles.questionText}>{q.text}</Text>
        <View style={styles.optionRow}>
            {options.map((option) => (
            <TouchableOpacity
                key={option}
                style={[
                styles.optionButton,
                answers[q.code] === option && styles.selectedOption,
                ]}
                onPress={() => handleSelect(q.code, option)}
            >
                <Text
                style={[
                    styles.optionText,
                    answers[q.code] === option && styles.selectedText,
                ]}
                >
                {option}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
        </View>
    ))}

    {loading ? (
        <ActivityIndicator size="large" color="#534DD9" style={{ marginVertical: 20 }} />
    ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
    )}

    {/* hasil screening */}
    {result && (
        <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Hasil Pemantauan</Text>
        {Object.entries(result).map(([kategori, detail]) => (
            <View key={kategori} style={styles.resultItem}>
            <Text style={styles.resultCategory}>
                {kategori}: <Text style={{ color: "#534DD9" }}>{detail.kategori}</Text>
            </Text>
            <Text style={styles.resultText}>{detail.keterangan}</Text>
            </View>
        ))}
        </View>
    )}
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F3EFFF",
    padding: 16,
},
title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#041062",
},
infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
},
infoTitle: {
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
    color: "#041062",
},
infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
},
questionBox: {
    backgroundColor: "#e6e1fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
},
questionText: {
    fontSize: 15,
    marginBottom: 12,
    color: "#041062",
    fontWeight: "600",
},
optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
},
optionButton: {
    backgroundColor: "#d1c9f7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 4,
    flex: 1,
    alignItems: "center",
},
optionText: {
    color: "#041062",
    fontWeight: "600",
},
selectedOption: {
    backgroundColor: "#534DD9",
},
selectedText: {
    color: "#fff",
},
submitButton: {
    backgroundColor: "#534DD9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
},
submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
},
resultBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 30,
},
resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#041062",
    marginBottom: 10,
},
resultItem: {
    marginBottom: 10,
},
resultCategory: {
    fontWeight: "700",
    color: "#041062",
    fontSize: 15,
    marginBottom: 4,
},
resultText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
},
});
