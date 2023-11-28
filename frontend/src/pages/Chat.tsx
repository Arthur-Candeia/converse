/* eslint-disable */
import { useEffect, useRef, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chat.module.scss'
import BASE_URL from '../api/BASE_URL';
import { useAppContext } from '../contexts/AppContext';

export function Chat() {
  const [message, setMessage] = useState('')
  const [socket] = useState(() => io(BASE_URL))
  const [messages, setMessages] = useState<{message: string, isMe: boolean}[]>([])
  const [photo, setPhoto] = useState<any>('')
  const {img} = useAppContext()
  const imgUserRef = useRef<HTMLImageElement>(null)
  const personRef = useRef<HTMLHeadingElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)
  const name = JSON.parse(sessionStorage.name ?? null)
  const room = JSON.parse(sessionStorage.room ?? null)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!sessionStorage.name || !sessionStorage.room) navigate('/')
      socket.emit('room', {name, room, img})
      socket.on(`personInRoom${room}`, (names: {name: string, img: any}[]) => setHeader(names))
      socket.on(room, (message: string) => {
        setMessages((current) => [...current, {message: message, isMe: false}])
      })

    return () => {
      socket.off('room')
      socket.off(`personInRoom${room}`)
      socket.close()
    }
  }, [])

  function sendMessage() {
    if (message.trim() === '') return
    setMessages((current) => [...current, {message: message, isMe: true}])
    socket.emit('message', {room, message})
    setMessage('')
  }

  function setHeader(names: {name: string, img: any}[]) {
    if (names.length < 2) {
      personRef.current!.style.visibility = 'hidden'
      imgUserRef.current!.style.visibility = 'hidden'
      statusRef.current!.innerText = 'Offline'
      return
    }
    let verify = false
    console.log(names)
    names.forEach((element: {name: string, img: any}) => {
      if (element.name !== name) {
        verify = true
        personRef.current!.innerText = element.name
        personRef.current!.style.visibility = 'visible'
        imgUserRef.current!.style.visibility = 'visible'
        statusRef.current!.innerText = 'Online'
        setPhoto(element.img)
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
          <img src={photo ? URL.createObjectURL(new Blob([photo])) : "./user.png"} alt="User icon" ref={imgUserRef}/>
          <span>
            <h1 ref={personRef}>Person Name</h1>
            <p ref={statusRef}>Offline</p>
          </span>
        </div>
      </header>
      <ul className={styles.messages}>
        {messages.map((element: {message: string, isMe: boolean}, index) => <pre className={element.isMe ? styles.isMe : styles.isOther} key={index}>{element.message}</pre>)}
      </ul>
      <textarea rows={1} name="fieldMessage" id="fieldMessage" className={styles.fieldMessage} value={message} onChange={(ev) => setMessage(ev.target.value)}/>
      <IoIosSend className={styles.sendButton} onClick={sendMessage}/>
    </section>
  )
}