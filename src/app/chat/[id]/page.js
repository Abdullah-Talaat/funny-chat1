 "use client"

import { collection, onSnapshot, getDoc, doc, addDoc, query, orderBy } from "firebase/firestore"
import { useState, useEffect, useContext , useRef, Suspense} from "react"
import { useParams } from "next/navigation"
import { UseUser } from "@/app/layout"
import { db } from "@/app/firebase/firebase_confage"
import Link from "next/link"
import Loading from "@/app/loading"
import Loder from "@/app/coms/loder"


export default function Chat_P() {
  const lastMessageRef = useRef(null)
  const { id } = useParams()
  const { user } = useContext(UseUser)
  const [chat, setChat] = useState([])
  const [user1, setUser1] = useState({
    userName: "",
    userNum: "000",
    score: 100,
    userPhoto: null
  })
  const [msgData, setMsgData] = useState({
    from: "",
    to: "",
    msgContant: "",
    msgKey: "",
    msgData: ""
  })
  const [stickM , setStickM] = useState(false)
  const [stickers, setStickers] = useState([])
  useEffect(() => {
    getDoc(doc(db, "users", id)).then((docSnap) => {
      if (docSnap.exists()) {
        setUser1(docSnap.data())
      }
    })
  }, [id])

  useEffect(() => {
    const q = query(collection(db, "allPrivateChats"), orderBy("msgData"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setChat(fetchedChats)
    })

    return () => unsubscribe()
  }, [])
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stickers_level_1"), (snapshot) => {
      const fetchedStickers = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setStickers(fetchedStickers)
      return () => unsubscribe()
    })

  }, [])

  
  const handleSubmit = async () => {
    if (!msgData.msgContant.trim()) {
      alert("Please fill in the required fields.")
      return
    }

    const date = new Date()
    const time = date.toLocaleTimeString()
    const date1 = date.toLocaleDateString()
    const date2 = `${time}/${date1}`
    await addDoc(collection(db, "allPrivateChats"), {
      from: user.id,
      to: id,
      msgContant: msgData.msgContant,
      msgKey: `${user.id}-a-m-123-${id}`,
      type: "text",
      msgData: date2
    })

    setMsgData({
      from: "",
      to: "",
      msgContant: "",
      msgKey: "",
      msgData: ""
    })
  }
  if(user.userOk === false) return (
    <>you should go to <Link href={"/log_in"} style={{
      color:"blue"
    }}>log in</Link> or <Link href={"/sign_up"} style={{
      color:"blue"
    }}>sign up</Link></>
  )
  const handleSticker = (url) => {
    setStickM(false)
    const date = new Date()
    const time = date.toLocaleTimeString()
    const date1 = date.toLocaleDateString()
    const date2 = `${time}/${date1}`
    addDoc(collection(db, "allPrivateChats"), {
      from: user.id,
      to: id,
      msgContant: url,
      msgKey: `${user.id}-a-m-123-${id}`,
      type: "img",
      msgData: date2}
      )
  }

                console.log(stickers)
  return (
    <main>
      <div className="list">
        <Link href={`/profile_anther/${id}`}>
          <div className="friend">
            <div className="wd dm">
              <img src={user1.userPhoto} alt="User Photo" />
            </div>
            <div className="friend-info">
              <h4>{user1.userName}</h4>
              <h5>{user1.userNum}</h5>
            </div>
          </div>
          <hr />
        </Link>
      </div>

      <Suspense fallback={<Loder/>} >
      <div className="chat-c">
        {chat.map((message, index) => (
          
          message.type == "text" ? (
            message.from === user.id && message.to === id ? (
            <div key={message.id} className="chat-c-1" ref={index == chat.length - 1 ? lastMessageRef : null}>
              <div className="c-1">{message.msgContant}</div>
              <div className="date">{message.msgData}</div>
            </div>
          ) : message.from === id && message.to === user.id ? (
            <div key={message.id} className="chat-c-2" ref={index == chat.length - 1 ? lastMessageRef : null}>
              <div className="date">{message.msgData}</div>
              <div className="c-2">{message.msgContant}</div>
            </div>
          ) : null): (
            message.from === user.id && message.to === id ? (
              <div key={message.id} className="chat-c-1" ref={index == chat.length - 1 ? lastMessageRef : null}>
                <div className="c-1">
                  <img className="mm" src={message.msgContant} alt="sticker" />
                </div>
                <div className="date">{message.msgData}</div>
              </div>
            ): (
              message.from === id && message.to === user.id ? (
                <div key={message.id} className="chat-c-2" ref={index == chat.length - 1 ? lastMessageRef : null}>
                  <div className="date">{message.msgData}</div>
                  <div className="c-2">
                    <img className="mm" src={message.msgContant} alt="sticker" />
                  </div>
                </div>
              ) : null
            )
          )
        ))}
      </div>

      <div className="chat">
        <textarea
          className="input"
          onChange={(e) => setMsgData({ ...msgData, msgContant: e.target.value })}
          value={msgData.msgContant}
          placeholder="Write your message here"
        />
        <div className ="btns">
        <button onClick={handleSubmit} >Send</button>
        <button  onClick={() => setStickM(!stickM)}>stick</button>
        </div>
      </div>
      <div style={stickM ?{
        display:"flex"
      }: {
        display:"none"
      }} className="stick">
        {
          stickers.map((sticker) => (
            <div className="sticker" onClick={() => handleSticker(sticker.url)}>
              <img src={sticker.url}></img>
              <p>{sticker.name}</p></div>
          ))
        }
        <button onClick={() => setStickM(0)} className="close">x</button>
      </div>
      </Suspense>
    </main>
  )
}