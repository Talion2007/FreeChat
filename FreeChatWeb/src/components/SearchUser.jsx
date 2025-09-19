import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles.css"; // importar CSS

export default function UserList({ setSelectedUser }) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("@");
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) return;

        async function fetchUsers() {
            const usersCol = collection(db, "users");
            const userSnapshot = await getDocs(usersCol);
            const allUsers = userSnapshot.docs
                .map(doc => doc.data())
                .filter(u => u.uid !== currentUser.uid);
            setUsers(allUsers);
        }

        fetchUsers();
    }, [currentUser]);

    const handleSearch = async () => {
        if (!search.startsWith("@")) return alert("Digite com @");

        const q = query(collection(db, "users"), where("username", "==", search));
        const snap = await getDocs(q);
        if (!snap.empty) setUsers(snap.docs.map(doc => doc.data()));
        else alert("Usuário não encontrado");
    };

    return (
        <div className="user-list-container">

            <h2 className="user-list-title">Usuários</h2>
            <ul className="user-list">
                {users.map(u => (
                    <li key={u.uid} onClick={() => setSelectedUser(u)}>
                        <strong>{u.username}</strong>
                        <span>{u.email}</span>
                    </li>
                ))}
            </ul>
            <div className="user-search">
                <input
                    type="text"
                    placeholder="@username"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button onClick={handleSearch}>Pesquisar</button>
            </div>
        </div>
    );
}
