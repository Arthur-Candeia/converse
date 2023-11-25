import { FormEvent, useState, useRef } from 'react';
import styles from '../styles/Home.module.scss';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api/BASE_URL';

export function Home() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const navigate = useNavigate()
  const displayError = useRef<HTMLSpanElement>(null)

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (name.trim() === '' || room.trim() === '') {
      displayError.current!.innerText = 'Insira nome e sala'
      displayError.current!.style.visibility = 'visible'
      return
    }
    
    const result = await fetch(`${BASE_URL}/${room}`)
    const data = await result.json()
    if (Object.prototype.hasOwnProperty.call(data, 'err')) {
      displayError.current!.innerText = data.err
      displayError.current!.style.visibility = 'visible'
      return
    }

    sessionStorage.name = JSON.stringify(name)
    sessionStorage.room = JSON.stringify(room)
    navigate('/chat')
  }

  return (
    <section className={styles.home}>
      <div className={styles.content}>
        <h1>CONVERSE</h1>
        <form autoComplete="off" className={styles.formLogin} onSubmit={handleSubmit}>
          <input type="text" name="name" id="name" placeholder="Seu nome" value={name} onChange={(ev) => setName(ev.target.value)} required/>
          <input type="text" name="room" id="room" placeholder="Nome da sala" value={room} onChange={(ev) => setRoom(ev.target.value)} required/>
          <span className={styles.message} ref={displayError}>.</span>
          <input type="submit" value="ENTRAR" />
        </form>
      </div>
    </section>
  )
}