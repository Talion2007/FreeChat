import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSignUp = async () => {
        if (!username.startsWith("@")) return Alert.alert("Erro", "O username deve começar com @");

        const q = query(collection(db, "users"), where("username", "==", username));
        const snap = await getDocs(q);
        if (!snap.empty) return Alert.alert("Erro", "Username já existe");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email,
                username,
            });
            navigation.replace("Home");
        } catch (err) {
            Alert.alert("Erro", err.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace("Home");
        } catch (err) {
            Alert.alert("Erro", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FreeChat</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <TextInput placeholder="@username" value={username} onChangeText={setUsername} style={styles.input} />
            <Pressable style={[styles.button, { backgroundColor: "green" }]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: "#001f3f" }]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f5", padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 25, color: "#001f3f" },
    input: { width: "100%", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, backgroundColor: "#fff" },
    button: { width: "100%", padding: 12, borderRadius: 12, marginBottom: 10, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" }
});
