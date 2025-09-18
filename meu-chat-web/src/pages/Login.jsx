import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // o CSS abaixo vai estar aqui

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (!username.startsWith("@")) return alert("O username deve começar com @");

        const q = query(collection(db, "users"), where("username", "==", username));
        const snap = await getDocs(q);
        if (!snap.empty) return alert("Username já existe");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email,
                username
            });
            navigate("/home");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-container">
                <h1>FreeChat</h1>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
                <input type="text" placeholder="@username" value={username} onChange={e => setUsername(e.target.value)} />
                <button onClick={handleSignUp}>Cadastrar</button>
                <button onClick={handleLogin}>Entrar</button>
            </div>
        </div>
    );
}
