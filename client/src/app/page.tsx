'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { FormEvent, useState } from 'react';

interface FormValues {
  name: string;
  room: string;
}

export default function Home() {
  const [values, setValues] = useState<FormValues>({ name: '', room: '' });

  const handleChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const isDisabled = Object.values(values).some((value) => !value);

    if (isDisabled) event.preventDefault();
  };

  const isFormValid = values.name.trim() !== '' && values.room.trim() !== ''; // Check if both fields are not empty

  return (
    <main className="main">
      <div className={`${styles.container} container`}>
        <h1 className="main_title">Chat</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              value={values.name}
              placeholder="Username"
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
              //
            />
            <input
              type="text"
              name="room"
              placeholder="Room"
              value={values.room}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
              //
            />
          </div>
          <Link href={`/chat?name=${values.name}&room=${values.room}`}>
            <button
              className={styles.button_submit}
              type="submit"
              disabled={!isFormValid}
              style={{
                opacity: isFormValid ? 1 : 0.5,
                backgroundColor: isFormValid ? '#69579c' : 'gray',
              }}
            >
              JOIN
            </button>
          </Link>
        </form>
      </div>
    </main>
  );
}
