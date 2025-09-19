// Importa Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAdZywpNQ_HhW-yBATItFcLbKLEyvwWxo",
  authDomain: "meuchatweb-6c863.firebaseapp.com",
  projectId: "meuchatweb-6c863",
  storageBucket: "meuchatweb-6c863.appspot.com",
  messagingSenderId: "1079217643825",
  appId: "1:1079217643825:web:1a27d2f2749c2b00069010",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore para usar no React
export const auth = getAuth(app);
export const db = getFirestore(app);
