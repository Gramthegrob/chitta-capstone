// components/AppContainer.js
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Container({ children, style }) {
return (
    <ScrollView
    style={styles.scroll}
    contentContainerStyle={[styles.container, style]}
    showsVerticalScrollIndicator={false}
    >
    {children}
    </ScrollView>
);
}

const styles = StyleSheet.create({
scroll: {
    flex: 1,
    backgroundColor: "#EFECFE", // warna ungu muda yang kamu pakai di semua screen
},
container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    paddingTop: 10,
},
});
