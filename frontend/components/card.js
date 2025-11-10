// components/ReusableCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Card({
title,
description,
children,
type = "default",
style,
}) {
const getBorderColor = () => {
    switch (type) {
    case "info":
        return "#534DD9"; // ungu
    default:
        return "#ddd";
    }
};


return (
    <View style={[styles.card, { borderLeftColor: getBorderColor() }, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {description && <Text style={styles.description}>{description}</Text>}
    {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
);
}

const styles = StyleSheet.create({
card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
},
title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#041062",
    marginBottom: 6,
},
description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
},
childrenContainer: {
    marginTop: 4,
},
});
