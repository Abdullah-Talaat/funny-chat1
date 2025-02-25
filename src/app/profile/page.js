"use client"
import { useState, useEffect, useContext } from "react"
import { UseUser } from "../layout"
import Link from "next/link"
import { db } from "../firebase/firebase_confage"
import { collection, onSnapshot, doc, updateDoc} from "firebase/firestore"

export default function Profile() {
    const [friends, setFriends] = useState([])
    const { user } = useContext(UseUser)

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
    const handleShare = () => {
        window.location.href = "https://api.whatsapp.com/send/?text=join funny chat now!"
        alert("App shared successfully!")

        /*doc(db, "users", user.id).update({
            score: user.score + 100,
        })*/
        updateDoc(doc(db, "users", user.id),{score:user.score + 100})
        .then(() => {
            alert("score update")
        })
        
    
    }
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
                <div className="share-btn" onClick={handleShare}>
                Share Now
                </div>
            </div>
        </main>
    )
}