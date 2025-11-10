import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    FlatList
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UNDIP_DATA } from "../../data/FakultasJurusan"; 

const SelectionModal = ({
    visible,
    title,
    items,
    searchQuery,
    onSearchChange,
    onSelectItem,
    onClose
}) => {
const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
    <Modal visible={visible} animationType="slide" transparent={false}>
    <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Tutup</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={{ width: 50 }} />
        </View>

        <TextInput
        style={styles.searchInput}
        placeholder={`Cari ${title}...`}
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
        />

        <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
                onSelectItem(item);
                onClose();
            }}
            >
            <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
        )}
        ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada hasil pencarian</Text>
        }
        />
    </View>
    </Modal>
);
};

export default function RegisterDetailScreen({ navigation }) {
const [nama, setNama] = useState("");
const [password, setPassword] = useState("");
const [ulangiPassword, setUlangiPassword] = useState("");
const [nim, setNim] = useState("");
const [fakultas, setFakultas] = useState("");
const [jurusan, setJurusan] = useState("");
const [semester, setSemester] = useState("");
const [gender, setGender] = useState("");

const [fakultasModalVisible, setFakultasModalVisible] = useState(false);
const [jurusanModalVisible, setJurusanModalVisible] = useState(false);
const [fakultasSearchQuery, setFakultasSearchQuery] = useState("");
const [jurusanSearchQuery, setJurusanSearchQuery] = useState("");

const fakultasList = Object.keys(UNDIP_DATA);
const jurusanList = fakultas ? UNDIP_DATA[fakultas] || [] : [];

const handleFakultasSelect = (selectedFakultas) => {
    setFakultas(selectedFakultas);
    setJurusan("");
    setJurusanSearchQuery("");
};

const handleNext = () => {
    if (
    !nama ||
    !password ||
    !ulangiPassword ||
    !nim ||
    !fakultas ||
    !jurusan ||
    !semester ||
    !gender
    ) {
    Alert.alert("Peringatan", "Harap isi semua data!");
    return;
    }
    if (password !== ulangiPassword) {
    Alert.alert("Peringatan", "Password tidak sama!");
    return;
    }
    Alert.alert("Sukses", "Data berhasil disimpan!");
    navigation.navigate("Login");
};

return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>SELESAIKAN PENDAFTARAN</Text>
    <Text style={styles.subtitle}>
        Lengkapi data dirimu sebelum melanjutkan.
    </Text>

    <Text style={styles.label}>Nama Panjang</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan nama lengkap"
        value={nama}
        onChangeText={setNama}
    />

    <Text style={styles.label}>Buat Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
    />

    <Text style={styles.label}>Ulangi Password</Text>
    <TextInput
        style={styles.input}
        placeholder="Ulangi password"
        secureTextEntry
        value={ulangiPassword}
        onChangeText={setUlangiPassword}
        autoCapitalize="none"
    />

    <Text style={styles.label}>NIM</Text>
    <TextInput
        style={styles.input}
        placeholder="Masukkan NIM"
        keyboardType="numeric"
        value={nim}
        onChangeText={setNim}
    />

    <Text style={styles.label}>Fakultas</Text>
    <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setFakultasModalVisible(true)}
    >
        <Text style={styles.searchButtonText}>
        {fakultas || "Pilih Fakultas..."}
        </Text>
    </TouchableOpacity>

    <SelectionModal
        visible={fakultasModalVisible}
        title="Pilih Fakultas"
        items={fakultasList}
        searchQuery={fakultasSearchQuery}
        onSearchChange={setFakultasSearchQuery}
        onSelectItem={handleFakultasSelect}
        onClose={() => setFakultasModalVisible(false)}
    />

    <Text style={styles.label}>Jurusan</Text>
    {fakultas ? (
        <>
        <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setJurusanModalVisible(true)}
        >
            <Text style={styles.searchButtonText}>
            {jurusan || "Pilih Jurusan..."}
            </Text>
        </TouchableOpacity>

        <SelectionModal
            visible={jurusanModalVisible}
            title="Pilih Jurusan"
            items={jurusanList}
            searchQuery={jurusanSearchQuery}
            onSearchChange={setJurusanSearchQuery}
            onSelectItem={(selectedJurusan) => {
            setJurusan(selectedJurusan);
            setJurusanSearchQuery("");
            }}
            onClose={() => setJurusanModalVisible(false)}
        />
        </>
    ) : (
        <Text style={styles.disabledText}>
        Pilih Fakultas terlebih dahulu
        </Text>
    )}

    <Text style={styles.label}>Semester</Text>
    <View style={styles.pickerContainer}>
        <Picker
        selectedValue={semester}
        onValueChange={(val) => setSemester(val)}
        >
        <Picker.Item label="Pilih Semester" value="" />
        {[...Array(12)].map((_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
        </Picker>
    </View>

    <Text style={styles.label}>Jenis Kelamin</Text>
    <View style={styles.pickerContainer}>
        <Picker
        selectedValue={gender}
        onValueChange={(val) => setGender(val)}
        >
        <Picker.Item label="Pilih Jenis Kelamin" value="" />
        <Picker.Item label="Laki‑laki" value="Laki‑laki" />
        <Picker.Item label="Perempuan" value="Perempuan" />
        </Picker>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>SELANJUTNYA</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    padding: 20,
    backgroundColor: "#F8F9FE",
    flexGrow: 1,
},
title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
},
subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
},
label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
},
input: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    color: "#000",
},
pickerContainer: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    color: "#000",
},
searchButton: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    justifyContent: "center",
},
searchButtonText: {
    color: "#333",
    fontSize: 14,
},
disabledText: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    color: "#999",
    fontSize: 14,
},
button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
},
buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
},
modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
},
modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 10,
},
modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
},
closeButton: {
    color: "#5A67D8",
    fontSize: 14,
    fontWeight: "600",
},
searchInput: {
    borderWidth: 1,
    borderColor: "#5A67D8",
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
},
listItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
},
listItemText: {
    fontSize: 14,
    color: "#333",
},
emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 14,
},
});
