import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../src/firebase/firebase"
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const AuthContext = createContext();

setPersistence(auth, browserSessionPersistence);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sottoscrive i cambi di autentificazione (login/logout/refresh)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if(currentUser) {
        // Controllo se è un paziente
        const docRefP = doc(db, "pazienti", currentUser.uid);
        const snapP = await getDoc(docRefP);

        if(snapP.exists()) {
          setUserData({...snapP.data(), ruolo: "paziente" });
        } else {
          // Altrimenti cerco nei sanitari
          const docRefS = doc(db, "sanitari", currentUser.uid);
          const snapS = await getDoc(docRefS);

          if(snapS.exists()) {
            setUserData({...snapS.data(), ruolo: "sanitario"});
          } else {
            // Non trovato da nessuna parte
            setUserData(null);
          }
        }
      } else {
        // Logout
        setUserData(null);
      }
      setLoading(false);
    });

    // Pulisce la sottoscrizione quando il provider si smonta
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
