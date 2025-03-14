"use client"
import { useState, useEffect, useContext } from "react"
import { UseUser } from "../layout"
import Link from "next/link"
import { db } from "../firebase/firebase_confage"
import { collection, onSnapshot, doc, updateDoc} from "firebase/firestore"
import SH from "../coms/should_log"
import Router from "next/router"

export default function Profile() {
    const { user } = useContext(UseUser)
    const handleSearch = () => {
        const herf1 = "https://api.whatsapp.com/send/?text=join funny chat now!       https://abdullah-t-funny-chat-hjni.vercel.app/ "
        location.herf = herf1
        updateDoc(doc(db, "users", user.id),{score:user.score + 100})
        .then(() => {
        alert("score update")
    })}
        const [friends, setFriends] = useState([])
        if(user.userOk === false) return (<SH/>)
    useEffect(() => {
        if (!user || !user.userFriends) return;
        
        const unsubscribes = user.userFriends.map((id) => {
            const docRef = doc(db, "users", id)
            return onSnapshot(docRef, (doc) => {
                setFriends((prev) => {
                    // منع التكرار في القائمة
                    const existingIds = prev.map(f => f.id);
                    if (existingIds.includes(doc.id)) return prev;
                    return [...prev, { id: doc.id, ...doc.data() }];
                });
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user]);
    
    return (
        <main className="m-p">
            <div className="userProfile">
                <div className="dm">
                    <img src={user?.userPhoto} alt="user photo" />
                </div>
                <h3>{user?.userName}</h3>
                <Link className="edit-profile" href="/edit_profile">edit profile</Link>
            </div>

            <div className="list-of-friends">
                <h3>your friends</h3>
                <hr />
                <div className="list">
                    <hr></hr>
                    {friends.map((friend) => (
                        <Link key={friend.id} href={`/profile_anther/${friend.id}`}>
                        <div className="friend" key={friend.id}>
                            <div className="dm wd">
                                <img src={friend.userPhoto} alt="user photo" />
                            </div>
                            <div className="friend-info">
                             <h4>{friend.userName}</h4>
                             <h5>{friend.userNum}</h5>
                            </div>
                        </div>
                        </Link>
                    ))}
                    <hr></hr>
                </div>
            </div>

            <div className="profile-info">
                <h4>your number: <b>{user?.userNum}</b></h4>
                <hr />
                <h4>your score: <b>{user?.score}</b></h4>
                <hr />
                <h4>you have <b>{user?.userFriends?.length || 0}</b> friends</h4>
                <hr />
                <h4>your mode: <b>{user?.mode ? "public" : "private"}</b></h4>
            </div>

            <div className="share-app">
                <h3>share app with your friends to get points!!</h3>
                <div className="share-btn" onClick={handleSearch}>
                Share Now
                </div>
            </div>
            <div className="log-out">
                <button style={{ marginTop: "20px", padding: "10px 20px", background: "red", color: "#fff", border: "none", borderRadius: "5px" }} className="btn" onClick={() => {
                    localStorage.removeItem("user_token")
                    window.location.href = "/log_in"
                    user.userOk = false
                }}>log out</button>
            </div>
        </main>
    )
}