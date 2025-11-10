"use client"

import { useState, useMemo } from "react"
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Modal,
TextInput,
FlatList,
} from "react-native"
import Container from "../../components/container"
import Card from "../../components/card"
import { UNDIP_DATA } from "../../data/FakultasJurusan"

const DUMMY_MAHASISWA = [
{
    id: "1",
    nama: "Safira Septiandika Salsabila",
    nim: "21120122140147",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Perempuan",
    foto: null,
},
{
    id: "2",
    nama: "Syabina Kamila",
    nim: "21120122140132",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Perempuan",
    foto: null,
},
{
    id: "3",
    nama: "Bagaskara Dipowicaksono HP",
    nim: "21120122140119",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Laki-laki",
    foto: null,
},
{
    id: "4",
    nama: "Bagus Panggalih",
    nim: "21120122140106",
    fakultas: "Fakultas Teknik",
    jurusan: "Teknik Komputer",
    semester: "7",
    jenisKelamin: "Laki-laki",
    foto: null,
},
]

export default function DaftarMahasiswaDetailScreen() {
const [selectedFakultas, setSelectedFakultas] = useState("Pilih Fakultas")
const [sortBy, setSortBy] = useState("nama")
const [searchQuery, setSearchQuery] = useState("")
const [selectedMahasiswa, setSelectedMahasiswa] = useState(null)
const [modalVisible, setModalVisible] = useState(false)

// dropdown fakultas
const [showDropdown, setShowDropdown] = useState(false)
const [searchFakultas, setSearchFakultas] = useState("")

const fakultasList = Object.keys(UNDIP_DATA)

// Filter fakultas di dropdown berdasarkan input user
const filteredFakultasList = useMemo(() => {
    if (!searchFakultas) return fakultasList
    return fakultasList.filter((f) =>
    f.toLowerCase().includes(searchFakultas.toLowerCase())
    )
}, [searchFakultas])

// Filter dan urutkan mahasiswa
const filteredMahasiswa = useMemo(() => {
    let data = DUMMY_MAHASISWA.filter((m) => m.fakultas === selectedFakultas)

    if (searchQuery) {
    data = data.filter(
        (m) =>
        m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nim.includes(searchQuery)
    )
    }

    data.sort((a, b) => {
    if (sortBy === "nama") return a.nama.localeCompare(b.nama)
    else return a.nim.localeCompare(b.nim)
    })
    return data
}, [selectedFakultas, sortBy, searchQuery])

return (
    <Container>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Search Mahasiswa */}
        <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau NIM..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
        />
        </View>

        {/* Dropdown Fakultas */}
        <View style={styles.dropdownContainer}>
        <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
        >
            <Text style={styles.dropdownButtonText}>{selectedFakultas}</Text>
        </TouchableOpacity>

        {showDropdown && (
            <View style={styles.dropdownListContainer}>
            <TextInput
                style={styles.dropdownSearchInput}
                placeholder="Cari fakultas..."
                value={searchFakultas}
                onChangeText={setSearchFakultas}
            />
            <FlatList
                data={filteredFakultasList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                    setSelectedFakultas(item)
                    setShowDropdown(false)
                    setSearchFakultas("")
                    }}
                >
                    <Text
                    style={[
                        styles.dropdownItemText,
                        item === selectedFakultas && {
                        color: "#534DD9",
                        fontWeight: "600",
                        },
                    ]}
                    >
                    {item}
                    </Text>
                </TouchableOpacity>
                )}
            />
            </View>
        )}
        </View>

        {/* Sort */}
        <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Urutkan:</Text>
        <TouchableOpacity
            style={[
            styles.sortButton,
            sortBy === "nama" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("nama")}
        >
            <Text
            style={[
                styles.sortButtonText,
                sortBy === "nama" && styles.sortButtonTextActive,
            ]}
            >
            Nama
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
            styles.sortButton,
            sortBy === "nim" && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy("nim")}
        >
            <Text
            style={[
                styles.sortButtonText,
                sortBy === "nim" && styles.sortButtonTextActive,
            ]}
            >
            NIM
            </Text>
        </TouchableOpacity>
        </View>

        {/* Tabel Mahasiswa */}
        <Card title={`${selectedFakultas} (${filteredMahasiswa.length} mahasiswa)`}>
        {filteredMahasiswa.length === 0 ? (
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada mahasiswa ditemukan</Text>
            </View>
        ) : (
            <View>
            <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.nameCell]}>Nama</Text>
                <Text style={[styles.tableCell, styles.nimCell]}>NIM</Text>
                <Text style={[styles.tableCell, styles.actionCell]}>Aksi</Text>
            </View>
            {filteredMahasiswa.map((mhs) => (
                <TouchableOpacity
                key={mhs.id}
                style={styles.tableRow}
                onPress={() => {
                    setSelectedMahasiswa(mhs)
                    setModalVisible(true)
                }}
                >
                <Text style={[styles.tableCell, styles.nameCell]}>
                    {mhs.nama}
                </Text>
                <Text style={[styles.tableCell, styles.nimCell]}>{mhs.nim}</Text>
                <Text
                    style={[styles.tableCell, styles.actionCell, styles.actionText]}
                >
                    Lihat
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        )}
        </Card>
    </ScrollView>

    {/* Modal Detail Mahasiswa */}
    <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {selectedMahasiswa && (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                >
                <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Detail Mahasiswa</Text>
                <View style={styles.fotoContainer}>
                <View style={[styles.fotoPlaceholder, { backgroundColor: "#E0E0E0" }]} />
                </View>

                <View style={styles.modalInfoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nama:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.nama}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>NIM:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.nim}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Jurusan:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.jurusan}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fakultas:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.fakultas}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Semester:</Text>
                    <Text style={styles.infoValue}>{selectedMahasiswa.semester}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Jenis Kelamin:</Text>
                    <Text style={styles.infoValue}>
                    {selectedMahasiswa.jenisKelamin}
                    </Text>
                </View>
                </View>

                <Card title="Riwayat Pemantauan Terbaru">
                <View style={styles.historyItem}>
                    <Text style={styles.historyDate}>15 Januari 2025</Text>
                    <Text style={styles.historyText}>
                    Depresi: Sedang | Kecemasan: Ringan | Stres: Sedang
                    </Text>
                </View>
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
scrollContainer: { paddingBottom: 30 },
searchContainer: { marginBottom: 15 },
searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
},
// === Dropdown Fakultas ===
dropdownContainer: { marginBottom: 15 },
dropdownButton: {
    backgroundColor: "#E9E8FF",
    padding: 10,
    borderRadius: 8,
},
dropdownButtonText: { color: "#041062", fontWeight: "600", fontSize: 14 },
dropdownListContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 6,
    maxHeight: 180,
},
dropdownSearchInput: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 13,
    color: "#333",
},
dropdownItem: { padding: 10 },
dropdownItemText: { fontSize: 13, color: "#333" },

// === Sort dan tabel tetap ===
sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
},
sortLabel: { fontSize: 14, fontWeight: "600", marginRight: 10, color: "#333" },
sortButton: {
    backgroundColor: "#E9E8FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
},
sortButtonActive: { backgroundColor: "#534DD9" },
sortButtonText: { color: "#041062", fontSize: 13, fontWeight: "500" },
sortButtonTextActive: { color: "#fff" },

emptyContainer: { alignItems: "center", paddingVertical: 30 },
emptyText: { color: "#999", fontSize: 14 },
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
tableCell: { fontSize: 13, color: "#333" },
nameCell: { flex: 2 },
nimCell: { flex: 1.5, textAlign: "center" },
actionCell: { flex: 1, textAlign: "center" },
actionText: { color: "#534DD9", fontWeight: "600" },

modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
},
modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingTop: 20,
},
modalScrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
closeButton: { alignItems: "flex-end", marginBottom: 10 },
closeButtonText: { fontSize: 24, color: "#999", fontWeight: "bold" },
modalTitle: { fontSize: 20, fontWeight: "bold", color: "#041062", marginBottom: 15 },
fotoContainer: { alignItems: "center", marginBottom: 20 },
fotoPlaceholder: { width: 100, height: 100, borderRadius: 50 },
modalInfoContainer: { marginBottom: 20 },
infoRow: { flexDirection: "row", marginBottom: 12 },
infoLabel: { fontSize: 14, fontWeight: "600", color: "#041062", width: 100 },
infoValue: { fontSize: 14, color: "#555", flex: 1 },
historyItem: {
    backgroundColor: "#F4F4FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#534DD9",
},
historyDate: { fontWeight: "bold", color: "#041062", marginBottom: 4 },
historyText: { color: "#555", fontSize: 13 },
})
