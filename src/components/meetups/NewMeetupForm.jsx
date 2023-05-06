import { useRef, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';

import Card from '../ui/Card';
import classes from './NewMeetupForm.module.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function NewMeetupForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);

  async function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.files[0];
    const enteredAddress = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const storageRef = ref(storage, `images/${enteredImage.name}`);
    const snapshot = await uploadBytes(storageRef, enteredImage);

    const downloadURL = await getDownloadURL(snapshot.ref);

    props.onAddMeetup({
      title: enteredTitle,
      image: downloadURL,
      address: enteredAddress,
      description: enteredDescription
    });
  }

  function imageChangeHandler() {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreviewImage(reader.result);
      }
    };

    reader.readAsDataURL(imageInputRef.current.files[0]);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor='image'>Meetup Image</label>
            <input
              type='file'
              accept='.jpg,.png,.jpeg'
              id='image'
              ref={imageInputRef}
              onChange={imageChangeHandler}
            />
            {previewImage && (
              <div className={classes.imagePreview}>
                <img src={previewImage} alt='Preview' />
              </div>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor='title'>Meetup Title</label>
            <input type='text' required id='title' ref={titleInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='address'>Address</label>
            <input type='text' required id='address' ref={addressInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              required
              rows='5'
              ref={descriptionInputRef}
            ></textarea>
          </div>
        </div>
        <div className={classes.actions}>
          <button>Add Meetup</button>
        </div>
      </form>
    </Card>
  );
}

export default NewMeetupForm;