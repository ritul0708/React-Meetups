import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import NewMeetupForm from '../components/meetups/NewMeetupForm';

function NewMeetupPage() {
  const navigate = useNavigate();

  async function addMeetupHandler(meetupData) {
    try {
      const docRef = await addDoc(collection(db, 'meetups'), {
        title: meetupData.title,
        image: meetupData.image,
        address: meetupData.address,
        description: meetupData.description
      });
      console.log('Document written with ID: ', docRef.id);
      navigate('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  return (
    <section>
      <h1>Add New Meetup</h1>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </section>
  );
}

export default NewMeetupPage;