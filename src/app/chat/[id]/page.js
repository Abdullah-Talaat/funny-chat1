"use client"

import { collection, onSnapshot, getDoc , doc, addDoc,serverTimestamp} from "firebase/firestore"
import { useState, useEffect, useContext } from "react"
import { useParams } from "next/navigation"
import { UseUser } from "@/app/layout"
import { db } from "@/app/firebase/firebase_confage"
import Link from "next/link"

export default function Chat_P() {
  
  const {id }= useParams()
  const {user} = useContext(UseUser)
  const [chat , setChat] = useState([])
  const [user1, setUser1] = useState({
    userName: "",
    userNum: "000",
    score: 100,
    userPhoto: ""
  })
  const [msgData, setMsgData] = useState({
    from:"",
    to:"",
    msgContant:"",
    msgKey:"",
    msgData:""
  })
  
  useEffect(() => {
    const unsubscribe = getDoc(doc(db, "users", id)).then((doc) => {
      setUser1(doc.data())
      return () => unsubscribe()
    })
  },[])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      return () => unsubscribe()
    })
  },[])
  
  const handleSubmit = async () => {
    if (msgData.msgContant == null) {
      alert("Please fill in the required fields.")
      return
    }
    else {
      addDoc(collection(db, "chats"),{
        from:user.id,
        to:id,
        msgContant:msgData.msgContant,
        msgKey:`${user.id}-a-m-123-${id}`,

        msgData: serverTimestamp()
      })
      setMsgData({
        from:"",
        to:"",
        msgContant:"",
        msgKey:"",
        msgData:""
      })
    }
  }
  const date1 = serverTimestamp()
  console.log(date1,0)
  return (
    <main>
      <div className="list">
        <Link href={"/profile_anther/"+id}>
          <div className="friend">
            <div className="wd dm">
              <img src={user1.userPhoto}></img>
            </div>
            <div className="friend-info">
              <h4>{user1.userName}</h4>
              <h5>{user1.userNum}</h5>
            </div>
          </div>
          <hr></hr>
        </Link>
      </div>
      <div className="chat">
        <textarea className="input" onChange={(e) => setMsgData({...msgData, msgContant:e.target.value})}value={msgData.msgContant} placeholder="write your massage here"></textarea>
        <button onClick={handleSubmit} className="btn">send</button>
      </div>
    </main>
  )
}