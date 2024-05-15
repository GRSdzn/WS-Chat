'use client';
import { FormEvent, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from '@/styles/chat.module.css';
import Link from 'next/link';
// import { getDate } from '@/features/getDate';
import { useRouter } from 'next/navigation';

// Create a single instance of the socket
let socket: Socket | null = null;

const ChatPage = ({ searchParams }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const { name, room } = searchParams;
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_URL || 'localhost:5000';

  useEffect(() => {
    // Create a new socket connection if it's not already initialized
    if (!socket) {
      socket = io(URL);

      socket.on('connect', () => {
        console.log('Connected to server!');

        // Join the chat room
        socket?.emit('join', { name: name, room: room });

        // Listen for incoming messages
        socket?.on('message', (data) => {
          console.log('Message from server:', data);
          setMessages((prevMessages) => [...prevMessages, data]);
        });
      });
    }

    return () => {
      if (socket) {
        socket.disconnect(); // Disconnect when the component unmounts
        socket = null; // Reset the socket instance
      }
    };
  }, [name, room]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message || !socket) return;

    // Send the message
    socket.emit('sendMessage', { message, params: { name, room } });

    // Clear the input field after sending the message
    setMessage('');
  };

  const leftOfTheRoom = () => {
    socket?.emit('leftRoom', { params: { name, room } });
    router.replace('/');
  };

  return (
    <section className="main">
      <div className="container">
        <div className={styles.header_container}>
          <h1>Chat Room: {room}</h1>
          <button className={styles.back_btn} onClick={leftOfTheRoom}>
            Back
          </button>
        </div>
        <div className={styles.messages_container}>
          {/* Display the current date */}
          <div className={styles.full_date}>{/* <p className={styles.date}>{getDate()}</p> */}</div>
          {/* Display messages */}
          {messages.length === 0 && <div className={styles.messages}>No messages yet</div>}
          {messages.map((msg, index) => (
            <div key={index} className={styles.messages}>
              <strong>{msg?.data?.user?.name}:</strong> {msg.data?.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.message_form}>
          <input value={message} onChange={handleChange} aria-description="Enter your message" placeholder="Enter your message" type="text" autoFocus className={styles.message_input} />
          <button type="submit" className={styles.send_btn} aria-description="Send message button">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatPage;
