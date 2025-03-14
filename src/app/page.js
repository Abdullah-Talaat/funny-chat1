"use client"
import { useState, useEffect, useContext } from "react"
import { db } from "./firebase/firebase_confage"
import { updateDoc , doc} from "firebase/firestore";
import { UseUser } from "./layout"
import Link from "next/link"
// import { handleShare } from "../app/profile/page"
export default function Home() {
  const handleShare = () => {
    window.location.href = "https://api.whatsapp.com/send/?text=join funny chat now!       https://abdullah-t-funny-chat-hjni.vercel.app/ "
    updateDoc(doc(db, "users", user.id),{score:user.score + 100})
    .then(() => {
      alert("score update")
    })
  }
  const {user} = useContext(UseUser)
  
  return (
    <main>
      <div className="home">
        <h1>hello, in funny chat 👋</h1>
        <hr></hr>
        <div className="share-app">
        {user.userOk ? (
          <Link href={"/chats"}>Go to chats</Link>
        ) : (
          <>
          <Link href={"/log_in"}>Log in</Link>
          If dont have account <Link href={"/sign_up"}>Sign up</Link>
          </>
        )}
        </div>
        {user.userOk ? (
          <div className="share-app">
          <h3>share app to get points!!</h3>
          <button onClick={handleShare} className="share-btn">Share Now</button>
        </div>
        ) : (
          <div></div>
        )
        
        }
      </div>
    </main>
  )
}