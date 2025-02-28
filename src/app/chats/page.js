"use client"
import { UseUser } from "../layout"
import { useEffect, useContext, useState } from "react"
import { db } from "../firebase/firebase_confage"
import { collection, onSnapshot } from "firebase/firestore"
import Link from "next/link"

export default function Chats() {
    const {user} = useContext(UseUser)
    const [users, setUsers] = useState([])
    // console.log(user.userFriends)
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const fetchedUsers = snapshot.docs.filter((doc) => user.userFriends.includes(doc.id)).map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setUsers(fetchedUsers)
        })
    
        return () => unsubscribe()
    }, [])
    
    return (
        <main>
          <h1 style={{textAlign:"center", paddingTop:"20px", paddingBottom:"20px"}}>Your Chats</h1>
          <div className="list">
            {users.map((user1) => (
                <Link href={`/chat/${user1.id}`} key={user1.id}>
                    <div className="friend">
                        <div className="dm wd">
                            <img src={user1.userPhoto}></img>
                        </div>
                        <div className="friend-info">
                            <h4>{user1.userName}</h4>
                            <h5>{user1.userNum}</h5>
                        </div>
                    </div> 
                    <hr></hr>   
                </Link>
            ))}
          </div>   
        </main>
    )
}