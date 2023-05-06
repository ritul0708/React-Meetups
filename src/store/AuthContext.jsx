import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password, displayName, photoURL, file) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Set display name and photo URL for the new user
        userCredential.user.updateProfile({
          displayName: displayName,
          photoURL: photoURL,
        }).then(() => {
          console.log('Display name and photo URL updated successfully!');
        }).catch((error) => {
          console.error(error);
        });
  
        // Upload profile picture to Firebase Storage
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`users/${userCredential.user.uid}/profile_picture`);
        return fileRef.put(file);
      })
      .then((snapshot) => {
        console.log('Profile picture uploaded successfully!');
        return snapshot.ref.getDownloadURL();
      })
      .then((downloadURL) => {
        // Update user document in Firestore with the profile picture download URL
        const userRef = firestore.collection('users').doc(userCredential.user.uid);
        return userRef.update({
          photoURL: downloadURL,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};