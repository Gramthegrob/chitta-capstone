import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function SplashScreen({ navigation }) {
return (
    <View style={styles.container}>
    {/* Logo */}
    <Image
        source={require('../../assets/chitta.png')}
        style={styles.logo}
        resizeMode="contain"
    />

    {/* Selamat Datang */}
    <Text style={styles.welcome}>SELAMAT DATANG</Text>

    {/* Tombol Login */}
    <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")} // arahkan ke halaman Login
    >
        <Text style={styles.loginText}>LOG IN</Text>
    </TouchableOpacity>

    {/* Link Daftar */}
    <Text style={styles.registerText}>
        Baru?{" "}
        <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
        >
        daftar sekarang
        </Text>
    </Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FE",
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    welcome: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#000",
    },
    loginButton: {
        backgroundColor: "#5A67D8",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2, // untuk efek shadow di Android
    },
    loginText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    registerText: {
        fontSize: 14,
        color: "#333",
    },
    link: {
        color: "#5A67D8",
        fontWeight: "500",
    },
});
