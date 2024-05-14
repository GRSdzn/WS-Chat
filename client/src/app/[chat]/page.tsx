'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from '@/styles/chat.module.css';
import Link from 'next/link';

const ChatPage = ({ searchParams }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const { name, room } = searchParams;

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Поменяйте URL на ваш адрес сервера

    socket.on('connect', () => {
      console.log('Connected to server!');

      // Пример отправки сообщения на сервер
      socket.emit('join', { name: name, room: room });

      // Пример получения сообщения от сервера
      socket.on('message', (data) => {
        console.log('Message from server:', data);
        setMessages((prevState) => [...prevState, data]);
      });
    });

    return () => {
      socket.disconnect(); // Отключаемся от сервера при размонтировании компонента
    };
  }, []);

  console.log(messages, 'msg');

  // функция получения даты и времени
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDay();
  let fullDate = year + '.' + month + '.' + day;

  return (
    <section className="main">
      <div className="container">
        <div className={styles.header_container}>
          <h1>Chat Room: {room}</h1>
          <Link href={'/'}>
            <button className={styles.back_btn}>Back</button>
          </Link>
        </div>
        <div className={styles.messages_container}>
          {/* отображения времени с лининей разделителем */}
          <div className={styles.full_date}>
            <p className={styles.date}>{fullDate}</p>
          </div>
          {/* в случае если сообщений нет */}
          {messages.length === 0 && <div className={styles.messages}>No messages yet</div>}
          {/* вывод сообщений */}
          {messages.map((message, index) => (
            <div key={index} className={styles.messages}>
              <strong>{message?.data?.user?.name}:</strong>
              {message.data?.message}
            </div>
          ))}
        </div>
        <form className={styles.message_form}>
          <input onChange={(e) => console.log(e.target.value)} aria-description="Enter your message" placeholder="Enter your message" type="search" autoFocus className={styles.message_input} />
          <button type="submit" className={styles.send_btn} aria-description="Send message button">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatPage;
