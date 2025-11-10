import { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"


import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen"
import KesadaranPenuhScreen from "./screens/KesadaranPenuhScreen"
import PemantauanStresScreen from "./screens/PemantauanStresScreen"
import PelacakanTidurScreen from "./screens/PelacakanTidurScreen"
import PemantauanMahasiswaScreen from "./screens/PemantauanMahasiswaScreen"
import KonsultasiScreen from "./screens/KonsultasiScreen"
import MusicScreen from "./screens/kesadaranpenuh/MusicScreen"
import BreathingScreen from "./screens/kesadaranpenuh/BreathingScreen"
import JournalScreen from "./screens/kesadaranpenuh/JournalScreen"
import TipsTidurScreen from "./screens/tips/TipsTidurScreen"
import TipsStresScreen from "./screens/tips/TipsStresScreen"
import IsiPemantauanScreen from "./screens/screening/IsiPemantauanScreen"
import HasilPemantauanScreen from "./screens/screening/HasilPemantauanScreen"


import SplashScreen from "./screens/auth/SplashScreen"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import RegisterDetailScreen from "./screens/auth/RegisterDetailScreen"


import AdminHomeScreen from "./screens/admin/AdminHomeScreen"
import RiwayatPemantauanMahasiswaScreen from "./screens/admin/RiwayatPemantauanMahasiswaScreen"
import DaftarMahasiswaDetailScreen from "./screens/admin/DaftarMahasiswaDetailScreen"
import ProfileAdminScreen from "./screens/admin/ProfileAdminScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null) 

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#F3EFFF" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterDetail" component={RegisterDetailScreen} options={{ title: "Register" }} />
          </>
        ) : userRole === "admin" ? (
          // ===================== ADMIN ROUTES =====================
          <>
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile Admin">
              {(props) => <ProfileAdminScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen
              name="Riwayat Pemantauan"
              component={RiwayatPemantauanMahasiswaScreen}
            />
            <Stack.Screen
              name="Daftar Mahasiswa"
              component={DaftarMahasiswaDetailScreen}
            />
          </>
        ) : (
          // ===================== MAHASISWA ROUTES =====================
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Profile"
              children={(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              options={{ title: "Profil" }}
            />
            <Stack.Screen name="Kesadaran Penuh" component={KesadaranPenuhScreen} />
            <Stack.Screen name="Pemantauan Mahasiswa" component={PemantauanMahasiswaScreen} />
            <Stack.Screen name="Isi Pemantauan" component={IsiPemantauanScreen} />
            <Stack.Screen name="Hasil Pemantauan" component={HasilPemantauanScreen} />
            <Stack.Screen name="Konsultasi" component={KonsultasiScreen} />
            <Stack.Screen name="Pelacakan Tidur" component={PelacakanTidurScreen} />
            <Stack.Screen name="Tips Tidur" component={TipsTidurScreen} />
            <Stack.Screen name="Pemantauan Stres" component={PemantauanStresScreen} />
            <Stack.Screen name="Tips Stres" component={TipsStresScreen} />
            <Stack.Screen name="Music" component={MusicScreen} options={{ title: "Musik Relaksasi" }} />
            <Stack.Screen name="Breathing" component={BreathingScreen} options={{ title: "Latihan Pernapasan" }} />
            <Stack.Screen name="Journal" component={JournalScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}