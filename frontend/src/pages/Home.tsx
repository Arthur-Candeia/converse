/* eslint-disable */
import { FormEvent, useState, useRef, ChangeEvent } from 'react';
import styles from '../styles/Home.module.scss';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api/BASE_URL';
import { useAppContext } from '../contexts/AppContext';

export function Home() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [photo] = useState<any>('')
  const {setImg} = useAppContext()
  const labelImg = useRef<HTMLLabelElement>(null)
  const navigate = useNavigate()
  const displayError = useRef<HTMLSpanElement>(null)

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (name.trim() === '' || room.trim() === '') {
      displayError.current!.innerText = 'Insira nome e sala'
      displayError.current!.style.visibility = 'visible'
      return
    }
    
    const result = await fetch(`${BASE_URL}/rooms/${room}`)
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

  function changePhoto(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files
    if (files && files.length > 0) {
      if (files[0].size > 3 * 1024 * 1024) return alert('A imagem excede o tamanho máximo de 3 MB')
      labelImg.current!.innerText = files[0].name
      setImg(files[0])
    }
  }

  return (
    <section className={styles.home}>
      <div className={styles.content}>
        <h1>CONVERSE</h1>
        <form autoComplete="off" className={styles.formLogin} onSubmit={handleSubmit}>
          <input type="text" name="name" id="name" placeholder="Seu nome" value={name} onChange={(ev) => setName(ev.target.value)} required minLength={4}/>
          <input type="text" name="room" id="room" placeholder="Nome da sala" value={room} onChange={(ev) => setRoom(ev.target.value)} required minLength={4}/>
          <input type="file" name="file" id="file" accept='image/jpeg, image/png' style={{display: 'none'}} value={photo} onChange={changePhoto} max={1}/>
          <label htmlFor="file" ref={labelImg}>Escolha uma imagem de perfil</label>
          <span className={styles.message} ref={displayError}>.</span>
          <input type="submit" value="ENTRAR" />
        </form>
      </div>
    </section>
  )
}