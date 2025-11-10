import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function TipsStresScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Tips Mengurangi Stres</Text>
                <Image
                    source={require('../../assets/stres.jpg')} 
                    style={styles.image} 
                />
                <Text style={styles.desc}>
                    Berikut beberapa tips untuk membantu Anda mendapatkan tidur yang lebih baik:
                </Text>
                
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFECFE',
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        margin: 0,
    },
    desc: {
        fontSize: 13,
        color: '#666',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },

});
