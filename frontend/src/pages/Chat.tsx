/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chat.module.scss'

export function Chat() {
  const [message, setMessage] = useState('')
  const [socket] = useState(() => io('http://localhost:3000'))
  const [messages, setMessages] = useState<{message: string, isMe: boolean}[]>([])
  const imgUserRef = useRef<HTMLImageElement>(null)
  const personRef = useRef<HTMLHeadingElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)
  const name = JSON.parse(sessionStorage.name ?? null)
  const room = JSON.parse(sessionStorage.room ?? null)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!sessionStorage.name || !sessionStorage.room) navigate('/')
      socket.emit('room', {name, room})
      socket.on(`personInRoom${room}`, (names: string[]) => setHeader(names))
      socket.on(room, (message: string) => {
        setMessages((current) => [...current, {message: message, isMe: false}])
      })
  }, [])

  function sendMessage() {
    if (message.trim() === '') return
    setMessages((current) => [...current, {message: message, isMe: true}])
    socket.emit('message', {room, message})
    setMessage('')
  }

  function setHeader(names: string[]) {
    if (names.length < 2) return
    let verify = false
    names.forEach((element: string) => {
      if (element !== name) {
        verify = true
        personRef.current!.innerText = element
        personRef.current!.style.visibility = 'visible'
        imgUserRef.current!.style.visibility = 'visible'
        statusRef.current!.innerText = 'Online'
      }
    })
    if (!verify) {
      personRef.current!.innerText = name
      personRef.current!.style.visibility = 'visible'
      imgUserRef.current!.style.visibility = 'visible'
      statusRef.current!.innerText = 'Online'
    }
  }

  return (
    <section className={styles.chat}>
      <header className={styles.chatHeader}>
        <div>
          <img src="./user.png" alt="User icon" ref={imgUserRef}/>
          <span>
            <h1 ref={personRef}>Person Name</h1>
            <p ref={statusRef}>Offline</p>
          </span>
        </div>
      </header>
      <ul className={styles.messages}>
        {messages.map((element: {message: string, isMe: boolean}) => <pre className={element.isMe ? styles.isMe : styles.isOther}>{element.message}</pre>)}
      </ul>
      <textarea rows={1} name="fieldMessage" id="fieldMessage" className={styles.fieldMessage} value={message} onChange={(ev) => setMessage(ev.target.value)}/>
      <IoIosSend className={styles.sendButton} onClick={sendMessage}/>
    </section>
  )
}