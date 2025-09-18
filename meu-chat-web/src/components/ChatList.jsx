import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import "../styles.css";

export default function ChatList({ setSelectedUser }) {
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
        <div className="chat-list-container">
            <h2 className="chat-list-title">Conversas</h2>
            {chats.map(c => (
                <div
                    key={c.chatId}
                    className="chat-item"
                    onClick={() => setSelectedUser(c.partner)}
                >
                    <strong>{c.partner.username}</strong>
                    <span>{c.lastMessage}</span>
                </div>
            ))}
        </div>
    );
}
