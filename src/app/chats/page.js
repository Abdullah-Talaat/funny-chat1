"use client"
import { UseUser } from "../layout"
import { useEffect, useContext, useState, Suspense } from "react"
import { db } from "../firebase/firebase_confage"
import { collection, onSnapshot } from "firebase/firestore"
import Link from "next/link"
import Loder from "../coms/loder"
import SH from "../coms/should_log"

export default function Chats() {
    const {user} = useContext(UseUser)
    if (!user.userOk) return <SH/>
    const [users, setUsers] = useState([])
    // //(user.userFriends)
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
            
                <title>Chats</title>
        
          <h1 style={{textAlign:"center", paddingTop:"20px", paddingBottom:"20px"}}>Your Chats</h1>
          <Suspense fallback={<Loder/>}>
          <div className="list">
            {users.length != 0 ? (users.map((user1) => (
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
            ))) :
        (
            <>
                <p>you don't have any friends</p>
                <Link href={"/search"} className="link">search for friends</Link>
            </>
        )
            }
          </div>   
          </Suspense>
        </main>
    )
}