import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Assuming your firebase.js is in src/
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Firestore imports

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Now create a user document in Firestore
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email, // or userCredential.user.email
        role: 'customer', // Default role
        createdAt: new Date() // Optional: timestamp
      });
    } catch (firestoreError) {
      console.error("Error creating user document in Firestore: ", firestoreError);
      // Optionally, you could try to delete the Firebase Auth user if Firestore fails
      // to keep things consistent, but this adds complexity.
      // For now, we just log the error. The user account would exist in Auth but not Firestore.
      // This situation would need manual correction or a more robust error handling strategy.
      throw firestoreError; // Re-throw to indicate signup partially failed
    }
    return userCredential; // Return the original userCredential
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // TODO: Add function for updating email/password if needed later
  // function updateEmail(email) { /* ... */ }
  // function updatePassword(password) { /* ... */ }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch their role from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCurrentUser({ 
              ...user, // Spread the original Firebase user object
              role: userData.role  // Add the role from Firestore
            });
          } else {
            // User document doesn't exist in Firestore, this is unexpected if signup was successful
            // Or if this is an old user who signed up before roles were implemented.
            console.warn("User document not found in Firestore for UID:", user.uid);
            // Set current user without a role, or with a default/guest role
            setCurrentUser({ ...user, role: 'customer' }); // Fallback, or handle as appropriate
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          // Fallback: set user without a role or with a default/guest role if Firestore fetch fails
          setCurrentUser({ ...user, role: 'customer' }); 
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    // updateEmail, // Add if implemented
    // updatePassword, // Add if implemented
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
