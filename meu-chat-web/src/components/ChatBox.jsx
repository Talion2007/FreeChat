import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";
import "../styles.css";

export default function ChatBox({ partner }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const currentUser = auth.currentUser;
    const chatId = [currentUser.uid, partner.uid].sort().join("_");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(d => ({
                id: d.id,
                text: d.data().text,
                userId: d.data().user._id,
                username: d.data().user.name,
            })));
        });
        return () => unsubscribe();
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: currentUser.uid,
                name: currentUser.displayName || currentUser.email,
            },
        });

        await setDoc(doc(db, "userChats", currentUser.uid), {
            [partner.uid]: {
                chatId,
                partner,
                lastMessage: input,
                timestamp: Date.now(),
            },
        }, { merge: true });

        await setDoc(doc(db, "userChats", partner.uid), {
            [currentUser.uid]: {
                chatId,
                partner: {
                    uid: currentUser.uid,
                    username: currentUser.displayName || currentUser.email,
                },
                lastMessage: input,
                timestamp: Date.now(),
            },
        }, { merge: true });

        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chatbox-container">
            <div className="messages">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.userId === currentUser.uid ? "sent" : "received"}`}
                    >
                        <span className="username">{msg.username}</span>
                        <span className="text">{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Digite uma mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}
