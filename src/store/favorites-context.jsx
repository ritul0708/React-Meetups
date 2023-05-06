import { createContext, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (favoriteMeetup) => {},
  removeFavorite: (meetupId) => {},
  itemIsFavorite: (meetupId) => {}
});

export function FavoritesContextProvider(props) {
  const [userFavorites, setUserFavorites] = useState([]);

  async function addFavoriteHandler(favoriteMeetup) {
    try {
      // Add the meetup to the favorites collection in Firestore
      const meetupRef = doc(collection(db, 'favorites'));
      await addDoc(meetupRef, meetup);

      setUserFavorites((prevUserFavorites) => {
        return prevUserFavorites.concat(meetup);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFavoriteHandler(meetupId) {
    try {
      // Remove the meetup from the favorites collection in Firestore
      const q = query(collection(db, 'favorites'), where('id', '==', meetupId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setUserFavorites((prevUserFavorites) => {
        return prevUserFavorites.filter((meetup) => meetup.id !== meetupId);
      });
    } catch (error) {
      console.error(error);
    }
  }

  function isFavoriteHandler(meetupId) {
    return userFavorites.some((meetup) => meetup.id === meetupId);
  }

  async function fetchFavoritesHandler() {
    try {
      // Fetch the favorite meetups from the favorites collection in Firestore
      const q = query(collection(db, 'favorites'));
      const querySnapshot = await getDocs(q);
      const meetups = [];
      querySnapshot.forEach((doc) => {
        meetups.push(doc.data());
      });

      setUserFavorites(meetups);
    } catch (error) {
      console.error(error);
    }
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    isFavorite: isFavoriteHandler,
    fetchFavorites: fetchFavoritesHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;