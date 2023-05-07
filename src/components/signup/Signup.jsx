import { useRef, useState } from "react";
import { auth, db, storage } from "../../firebase/firebase";
import styles from "./signup.module.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function Signup() {
  const displayNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const imageInputRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        photoURLRef.current = reader.result;
      };
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth,
        emailRef.current,
        passwordRef.current
      );

      await updateProfile(userCredential.user, {
        displayName: displayNameRef.current,
        photoURL: photoURLRef.current,
      });

      await db.collection("users").doc(userCredential.user.uid).set({
        displayName: displayNameRef.current,
        photoURL: photoURLRef.current,
      });

      displayNameRef.current = "";
      emailRef.current = "";
      passwordRef.current = "";
      photoURLRef.current = null;
      errorRef.current = "";
    } catch (error) {
      errorRef.current = error.message;
    }
  };
  // console.log(user)

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignup}>
        <h2 className={styles.title}>Sign Up</h2>
        {errorRef.current && <p>{errorRef.current}</p>}
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            ref={displayNameRef}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            ref={emailRef}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            ref={passwordRef}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <div className={styles.preview}>
            {previewImage && (
              <div className={classes.imagePreview}>
                <img src={previewImage} alt='Preview' />
              </div>
            )}
          </div>
        </div>
        <button className={styles.button} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;