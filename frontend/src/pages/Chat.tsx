import { useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chat.module.scss'

export function Chat() {
  const navigate = useNavigate()
  const socket = io('http://localhost:3000')
  const name = JSON.parse(sessionStorage.name)
  const room = JSON.parse(sessionStorage.room)
  socket.emit('room', {name, room})
  socket.on('personInRoom', (names: string[]) => {console.log(names)})

  useEffect(() => {
    if (!sessionStorage.name || !sessionStorage.room) navigate('/')
  })

  return (
    <section className={styles.chat}>
      <ul className={styles.messages}></ul>
      <textarea rows={1} name="fieldMessage" id="fieldMessage" className={styles.fieldMessage} />
      <IoIosSend className={styles.sendButton}/>
    </section>
  )
}