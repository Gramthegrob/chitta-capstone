"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native"
import Container from "../../components/container"
import Card from "../../components/card"

// Data dummy riwayat pemantauan mahasiswa
const DUMMY_RIWAYAT = [
{
    id: "1",
    nama: "Budi Santoso",
    nim: "21120122140001",
    tanggal: "15 Januari 2025",
    detailRiwayat: [
    { tanggal: "15/01", Depresi: 2, Kecemasan: 2, Stres: 1 },
    { tanggal: "08/01", Depresi: 1, Kecemasan: 3, Stres: 2 },
    { tanggal: "01/01", Depresi: 2, Kecemasan: 2, Stres: 1 },
    ],
},
{
    id: "2",
    nama: "Siti Nurhaliza",
    nim: "21120122130002",
    tanggal: "14 Januari 2025",
    detailRiwayat: [
    { tanggal: "14/01", Depresi: 1, Kecemasan: 2, Stres: 2 },
    { tanggal: "07/01", Depresi: 2, Kecemasan: 1, Stres: 1 },
    ],
},
{
    id: "3",
    nama: "Ahmad Rizki",
    nim: "21120122140003",
    tanggal: "13 Januari 2025",
    detailRiwayat: [{ tanggal: "13/01", Depresi: 3, Kecemasan: 3, Stres: 2 }],
},
{
    id: "4",
    nama: "Dewi Kusuma",
    nim: "21120122130004",
    tanggal: "12 Januari 2025",
    detailRiwayat: [
    { tanggal: "12/01", Depresi: 1, Kecemasan: 1, Stres: 1 },
    { tanggal: "05/01", Depresi: 2, Kecemasan: 2, Stres: 3 },
    ],
},
{
    id: "5",
    nama: "Riyanto Wijaya",
    nim: "21120122140005",
    tanggal: "10 Januari 2025",
    detailRiwayat: [{ tanggal: "10/01", Depresi: 2, Kecemasan: 2, Stres: 2 }],
},
]

const levelKeterangan = {
1: "Ringan",
2: "Sedang",
3: "Berat",
4: "Sangat Berat",
}

export default function RiwayatPemantauanMahasiswaScreen() {
const [sortBy, setSortBy] = useState("nama") // "nama" atau "tanggal"
const [searchQuery, setSearchQuery] = useState("")
const [selectedRiwayat, setSelectedRiwayat] = useState(null)
const [modalVisible, setModalVisible] = useState(false)

// Filter dan sort data
const filteredRiwayat = useMemo(() => {
    let data = [...DUMMY_RIWAYAT]

    // Search
    if (searchQuery) {
    data = data.filter((r) => r.nama.toLowerCase().includes(searchQuery.toLowerCase()) || r.nim.includes(searchQuery))
    }

    // Sort
    data.sort((a, b) => {
    if (sortBy === "nama") {
        return a.nama.localeCompare(b.nama)
    } else {
        // Sort by tanggal (newest first)
        return new Date(b.tanggal) - new Date(a.tanggal)
    }
    })

    return data
}, [sortBy, searchQuery])

return (
    <Container>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau NIM..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
        />
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Urutkan:</Text>
        <TouchableOpacity
            style={[styles.sortButton, sortBy === "nama" && styles.sortButtonActive]}
            onPress={() => setSortBy("nama")}
        >
            <Text style={[styles.sortButtonText, sortBy === "nama" && styles.sortButtonTextActive]}>Nama</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.sortButton, sortBy === "tanggal" && styles.sortButtonActive]}
            onPress={() => setSortBy("tanggal")}
        >
            <Text style={[styles.sortButtonText, sortBy === "tanggal" && styles.sortButtonTextActive]}>Tanggal</Text>
        </TouchableOpacity>
        </View>

        {/* Tabel Riwayat */}
        <Card title={`Riwayat Pemantauan (${filteredRiwayat.length})`}>
        {filteredRiwayat.length === 0 ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada riwayat yang ditemukan</Text>
            </View>
        ) : (
            <View>
            {/* Header Tabel */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.nameCell]}>Nama</Text>
                <Text style={[styles.tableCell, styles.dateCell]}>Tanggal Pemantauan</Text>
                <Text style={[styles.tableCell, styles.actionCell]}>Aksi</Text>
            </View>

            {/* Isi Tabel */}
            {filteredRiwayat.map((riwayat) => (
                <TouchableOpacity
                key={riwayat.id}
                style={styles.tableRow}
                onPress={() => {
                    setSelectedRiwayat(riwayat)
                    setModalVisible(true)
                }}
                >
                <Text style={[styles.tableCell, styles.nameCell]}>{riwayat.nama}</Text>
                <Text style={[styles.tableCell, styles.dateCell]}>{riwayat.tanggal}</Text>
                <Text style={[styles.tableCell, styles.actionCell, styles.actionText]}>Buka</Text>
                </TouchableOpacity>
            ))}
            </View>
        )}
        </Card>
    </ScrollView>

    {/* Modal Detail Riwayat */}
    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {selectedRiwayat && (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Riwayat Pemantauan {selectedRiwayat.nama}</Text>

                <View style={styles.modalInfoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nama:</Text>
                    <Text style={styles.infoValue}>{selectedRiwayat.nama}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>NIM:</Text>
                    <Text style={styles.infoValue}>{selectedRiwayat.nim}</Text>
                </View>
                </View>

                {/* Detail Riwayat Pemantauan */}
                <Card title={`Pemantauan di Tanggal ${selectedRiwayat.tanggal}`}>
                {selectedRiwayat.detailRiwayat.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                    <Text style={styles.detailDate}>Tanggal: {detail.tanggal}</Text>
                    <View style={styles.detailContent}>
                        <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Depresi:</Text>
                        <Text style={styles.detailValue}>
                            {levelKeterangan[detail.Depresi]} (Level {detail.Depresi})
                        </Text>
                        </View>
                        <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Kecemasan:</Text>
                        <Text style={styles.detailValue}>
                            {levelKeterangan[detail.Kecemasan]} (Level {detail.Kecemasan})
                        </Text>
                        </View>
                        <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Stres:</Text>
                        <Text style={styles.detailValue}>
                            {levelKeterangan[detail.Stres]} (Level {detail.Stres})
                        </Text>
                        </View>
                    </View>
                    </View>
                ))}
                </Card>

                {/* Keterangan Level */}
                <Card title="Keterangan Level">
                <Text style={styles.keteranganText}>
                    <Text style={styles.bold}>1 (Ringan):</Text> Gejala ringan, dapat diatasi dengan relaksasi.
                </Text>
                <Text style={styles.keteranganText}>
                    <Text style={styles.bold}>2 (Sedang):</Text> Mulai mengganggu aktivitas, disarankan konsultasi.
                </Text>
                <Text style={styles.keteranganText}>
                    <Text style={styles.bold}>3 (Berat):</Text> Gejala intens, perlu dukungan profesional.
                </Text>
                <Text style={styles.keteranganText}>
                    <Text style={styles.bold}>4 (Sangat Berat):</Text> Gangguan fungsi harian, butuh psikiater.
                </Text>
                </Card>
            </ScrollView>
            )}
        </View>
        </View>
    </Modal>
    </Container>
)
}

const styles = StyleSheet.create({
scrollContainer: {
    paddingBottom: 30,
},
searchContainer: {
    marginBottom: 15,
},
searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
},
sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
},
sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    color: "#333",
},
sortButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
},
sortButtonActive: {
    backgroundColor: "#534DD9",
},
sortButtonText: {
    color: "#041062",
    fontSize: 13,
    fontWeight: "500",
},
sortButtonTextActive: {
    color: "#fff",
},
emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
},
emptyText: {
    color: "#999",
    fontSize: 14,
},
tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
},
tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
},
tableCell: {
    fontSize: 13,
    color: "#333",
},
nameCell: {
    flex: 1.5,
},
dateCell: {
    flex: 1.5,
},
actionCell: {
    flex: 0.7,
    textAlign: "center",
},
actionText: {
    color: "#534DD9",
    fontWeight: "600",
},
// Modal Styles
modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
},
modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
},
modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
},
closeButton: {
    alignItems: "flex-end",
    marginBottom: 10,
},
closeButtonText: {
    fontSize: 24,
    color: "#999",
    fontWeight: "bold",
},
modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 15,
},
modalInfoContainer: {
    marginBottom: 20,
},
infoRow: {
    flexDirection: "row",
    marginBottom: 12,
},
infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#041062",
    width: 100,
},
infoValue: {
    fontSize: 14,
    color: "#555",
    flex: 1,
},
detailItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#534DD9",
},
detailDate: {
    fontWeight: "bold",
    color: "#041062",
    marginBottom: 8,
},
detailContent: {
    marginTop: 8,
},
detailRow: {
    flexDirection: "row",
    marginBottom: 6,
},
detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    width: 100,
},
detailValue: {
    fontSize: 13,
    color: "#555",
    flex: 1,
},
keteranganText: {
    color: "#333",
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
},
bold: {
    fontWeight: "bold",
    color: "#041062",
},
})
