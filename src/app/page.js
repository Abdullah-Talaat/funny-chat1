"use client"
import { useState, useEffect, useContext } from "react"
import { UseUser } from "./layout"
import Link from "next/link"
import { handleShare } from "../app/profile/page"
export default async function Home() {
  const {user} = useContext(UseUser)
  console.log(user)
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
        <div className="share-app">
          <h3>share app to get points!!</h3>
          <button onClick={handleShare} className="share-btn">Share Now</button>
        </div>
      </div>
    </main>
  )
}