import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

export default function ChatList({ navigation }) {
    const [chats, setChats] = useState([]);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;
        const docRef = doc(db, "userChats", currentUser.uid);
        const unsub = onSnapshot(docRef, docSnap => {
            if (docSnap.exists()) setChats(Object.values(docSnap.data()));
        });
        return () => unsub();
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Conversas</Text>
            <ScrollView style={{ maxHeight: 240 }}>
                {chats.map(c => (
                    <Pressable key={c.chatId} style={styles.item} onPress={() => navigation.navigate("Chat", { partner: c.partner })}>
                        <Text style={styles.username}>{c.partner.username}</Text>
                        <Text style={styles.lastMessage}>{c.lastMessage}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15 },
    title: { fontWeight: "bold", fontSize: 18, marginBottom: 10, color: "#001f3f" },
    item: { padding: 12, backgroundColor: "#f7f7f7", borderRadius: 12, marginBottom: 10 },
    username: { fontWeight: "bold", color: "#001f3f" },
    lastMessage: { color: "#555", marginTop: 4 }
});
