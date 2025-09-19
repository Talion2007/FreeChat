import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserList({ navigation }) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("@");
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;
        async function fetchUsers() {
            const usersCol = collection(db, "users");
            const snap = await getDocs(usersCol);
            const allUsers = snap.docs.map(doc => doc.data()).filter(u => u.uid !== currentUser.uid);
            setUsers(allUsers);
        }
        fetchUsers();
    }, [currentUser]);

    const handleSearch = async () => {
        if (!search.startsWith("@")) return Alert.alert("Erro", "Digite com @");
        const q = query(collection(db, "users"), where("username", "==", search));
        const snap = await getDocs(q);
        if (!snap.empty) setUsers(snap.docs.map(doc => doc.data()));
        else Alert.alert("Erro", "Usuário não encontrado");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Usuários</Text>
            <ScrollView style={{ maxHeight: 220 }}>
                {users.map(u => (
                    <Pressable key={u.uid} style={styles.item} onPress={() => navigation.navigate("Chat", { partner: u })}>
                        <Text style={styles.username}>{u.username}</Text>
                        <Text style={styles.email}>{u.email}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={styles.searchBox}>
                <TextInput value={search} onChangeText={setSearch} style={styles.input} placeholder="@username" />
                <Pressable style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Pesquisar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15 },
    title: { fontWeight: "bold", fontSize: 18, marginBottom: 10, color: "#001f3f" },
    item: { padding: 12, backgroundColor: "#f7f7f7", borderRadius: 12, marginBottom: 10 },
    username: { fontWeight: "bold", color: "#001f3f" },
    email: { color: "#555" },
    searchBox: { marginTop: 15 },
    input: { padding: 10, borderWidth: 1, borderRadius: 12, marginBottom: 8, borderColor: "#ccc" },
    button: { backgroundColor: "#001f3f", padding: 12, borderRadius: 12, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" }
});
