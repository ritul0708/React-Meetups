import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore } from '../firebase/firebase';

const FavoriteContext = createContext();

export function useFavorite() {
  return useContext(FavoriteContext);
}

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = firestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('favorites')
      .onSnapshot((snapshot) => {
        const favoritesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoritesData);
      });

    return unsubscribe;
  }, [currentUser]);

  function addFavorite(meetup) {
    firestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('favorites')
      .add(meetup)
      .then(() => console.log('Favorite added successfully!'))
      .catch((error) => console.error(error));
  }

  function removeFavorite(favoriteId) {
    firestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('favorites')
      .doc(favoriteId)
      .delete()
      .then(() => console.log('Favorite removed successfully!'))
      .catch((error) => console.error(error));
  }

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}
