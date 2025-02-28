 "use client"

import { collection, onSnapshot, getDoc, doc, addDoc, query, orderBy } from "firebase/firestore"
import { useState, useEffect, useContext , useRef} from "react"
import { useParams } from "next/navigation"
import { UseUser } from "@/app/layout"
import { db } from "@/app/firebase/firebase_confage"
import Link from "next/link"

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
  const handleSubmit = async () => {
    if (!msgData.msgContant.trim()) {
      alert("Please fill in the required fields.")
      return
    }

    const date = new Date()
    const time = date.toLocaleTimeString()
    const date1 = date.toLocaleDateString()
    const date2 = `${time}  ${date1}`

    await addDoc(collection(db, "allPrivateChats"), {
      from: user.id,
      to: id,
      msgContant: msgData.msgContant,
      msgKey: `${user.id}-a-m-123-${id}`,
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

      <div className="chat-c">
        {chat ? ( chat.map((message, index) => (
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
          ) : null
        ))):
        <p>Loading...</p>
        }
      </div>

      <div className="chat">
        <textarea
          className="input"
          onChange={(e) => setMsgData({ ...msgData, msgContant: e.target.value })}
          value={msgData.msgContant}
          placeholder="Write your message here"
        />
        <button onClick={handleSubmit} className="btn">Send</button>
      </div>
    </main>
  )
}