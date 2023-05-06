import { useState } from "react";
import { auth, firestore, storage } from "../../firebase/firebase";
import styles from "./signup.module.css";

function Signup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [error, setError] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPhotoURL(reader.result);
      };
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await userCredential.user.updateProfile({
        displayName,
        photoURL,
      });

      await firestore.collection("users").doc(userCredential.user.uid).set({
        displayName,
        photoURL,
      });

      setDisplayName("");
      setEmail("");
      setPassword("");
      setPhotoURL(null);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignup}>
        <h2 className={styles.title}>Sign Up</h2>
        {error && <p>{error}</p>}
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Profile Picture</label>
          <div className={styles.preview}>
            {photoURL ? (
              <img src={photoURL} alt="Profile" />
            ) : (
              <span>No image selected</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </div>
        <button className={styles.button} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
