import React, { useState } from "react";
import ChatList from "../components/ChatList";
import SearchUser from "../components/SearchUser";
import ChatBox from "../components/ChatBox";
import "../styles.css";

export default function Home() {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="home-container">
            <div className="sidebar">
                <ChatList setSelectedUser={setSelectedUser} />
                <SearchUser setSelectedUser={setSelectedUser} />
            </div>
            <div className="chat-area">
                {selectedUser ? (
                    <ChatBox partner={selectedUser} />
                ) : (
                    <p className="placeholder-text">Selecione um usuário para conversar</p>
                )}
            </div>
        </div>
    );
}
