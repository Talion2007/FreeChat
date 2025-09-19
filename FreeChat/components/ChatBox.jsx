import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";

export default function ChatBox({ partner }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    const currentUser = auth.currentUser;
    const chatId = [currentUser.uid, partner.uid].sort().join("_");

    useEffect(() => {
        const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
        const unsub = onSnapshot(q, snapshot => {
            setMessages(snapshot.docs.map(d => ({
                id: d.id,
                text: d.data().text,
                userId: d.data().user._id,
                username: d.data().user.name,
            })));
        });
        return () => unsub();
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: input,
            createdAt: serverTimestamp(),
            user: { _id: currentUser.uid, name: currentUser.displayName || currentUser.email },
        });

        await setDoc(doc(db, "userChats", currentUser.uid), {
            [partner.uid]: { chatId, partner, lastMessage: input, timestamp: Date.now() },
        }, { merge: true });

        await setDoc(doc(db, "userChats", partner.uid), {
            [currentUser.uid]: { chatId, partner: { uid: currentUser.uid, username: currentUser.displayName || currentUser.email }, lastMessage: input, timestamp: Date.now() },
        }, { merge: true });

        setInput("");
        scrollRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <ScrollView
                        ref={scrollRef}
                        style={styles.messages}
                        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
                    >
                        {messages.map(msg => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.message,
                                    msg.userId === currentUser.uid ? styles.sent : styles.received
                                ]}
                            >
                                <Text style={styles.username}>{msg.username}</Text>
                                <Text style={styles.text}>{msg.text}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.inputArea}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            placeholder="Digite uma mensagem..."
                        />
                        <Pressable style={styles.button} onPress={sendMessage}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f6fa" },
    messages: { flex: 1, padding: 15 },
    message: { maxWidth: "70%", padding: 12, marginBottom: 12, borderRadius: 14 },
    sent: { alignSelf: "flex-end", backgroundColor: "#add8e6", borderBottomRightRadius: 0 },
    received: { alignSelf: "flex-start", backgroundColor: "#fff", borderBottomLeftRadius: 0 },
    username: { fontSize: 12, fontWeight: "bold", marginBottom: 3, color: "#333" },
    text: { fontSize: 14, color: "#000" },
    inputArea: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ccc", backgroundColor: "#fff" },
    input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15, marginRight: 10, padding: 10 },
    button: { backgroundColor: "#001f3f", paddingHorizontal: 20, borderRadius: 25, justifyContent: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" }
});
