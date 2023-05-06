import { useState, useEffect } from 'react';
import MeetupList from '../components/meetups/MeetupList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function AllMeetupsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    
    async function fetchMeetups() {
      const meetupCollection = collection(db, 'meetups');
      const querySnapshot = await getDocs(meetupCollection);

      const meetups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setIsLoading(false);
      setLoadedMeetups(meetups);
    }

    fetchMeetups();
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>All Meetups</h1>
      <MeetupList meetups={loadedMeetups} />
    </section>
  );
}

export default AllMeetupsPage;