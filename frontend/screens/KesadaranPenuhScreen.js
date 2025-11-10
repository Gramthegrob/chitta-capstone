import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Container from "../components/container";
import Card from "../components/card"; // pastikan path ini benar (../components/card.js)

export default function KesadaranPenuhScreen({ navigation }) {
return (
    <Container>
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Breathing")}>
        <Card style={styles.card} type="info">
        <Image source={require("../assets/nafas.png")} style={styles.image} />
        <Text style={styles.title}>Atur Pernapasan</Text>
        <Text style={styles.desc}>
            Latih pernapasan agar lebih tenang dan teratur. Fitur ini membantu Anda fokus pada
            irama napas untuk menenangkan pikiran dan mengurangi stres.
        </Text>
        </Card>
    </TouchableOpacity>

    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Journal")}>
        <Card style={styles.card} type="info">
        <Image source={require("../assets/jurnal.png")} style={styles.image} />
        <Text style={styles.title}>Jurnal</Text>
        <Text style={styles.desc}>
            Catat perasaan dan pengalaman harian Anda. Menulis jurnal membantu mengenali emosi,
            mengelola stres, dan meningkatkan kesadaran diri.
        </Text>
        </Card>
    </TouchableOpacity>

    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Music")}>
        <Card style={styles.card} type="info">
        <Image source={require("../assets/musik.png")} style={styles.image} />
        <Text style={styles.title}>Dengarkan Musik Relaksasi</Text>
        <Text style={styles.desc}>
            Nikmati musik relaksasi yang menenangkan untuk membantu Anda beristirahat,
            mengurangi kecemasan, dan memulihkan fokus setelah beraktivitas.
        </Text>
        </Card>
    </TouchableOpacity>
    </Container>
);
}

const styles = StyleSheet.create({
card: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
},
image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
    alignSelf: "center",
},
title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#041062",
    textAlign: "center",
    marginBottom: 6,
},
desc: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
},
});
