"use client"
import { useState, useEffect, useContext, use } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/firebase/firebase_confage";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { UseUser } from "@/app/layout";
import Link from "next/link";

export default function Anther_Profile() {
    const { user } = useContext(UseUser);
    const { id } = useParams();
    const [user11, setUser11] = useState(null);
    const [friendMode, setFriendMode] = useState(false);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (!id) return;
        const getUser = async () => {
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser11({ ...docSnap.data(), id: docSnap.id });
                } else {
                    alert("User not found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        getUser();
    }, [id]);

    useEffect(() => {
        if (!user11 || !user11.userFriends) return;

        const unsubscribes = user11.userFriends.map((id) => {
            const docRef = doc(db, "users", id);
            return onSnapshot(docRef, (doc) => {
                setFriends((prev) => {
                    const existingIds = prev.map(f => f.id);
                    if (existingIds.includes(doc.id)) return prev;
                    return [...prev, { id: doc.id, ...doc.data() }];
                });
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user11]);

    useEffect(() => {
        if (!user11) {
            console.log("no user");
        } else {
            const isFriend = friends.some((friend) => friend.id === user.id);
            setFriendMode(isFriend);
        }
    }, [friends, user]);

    const handleBeFriend = async () => {
        setFriendMode(true);
        await updateDoc(doc(db, "users", user11.id), {
            userFriends: [...user11.userFriends, user.id],
        });
        await updateDoc(doc(db, "users", user.id), {
            userFriends: [...user.userFriends, user11.id],
        });
    };

    const handleUnfriend = async () => {
        setFriendMode(false);
        const newUser11Friends = user11.userFriends.filter((friendId) => friendId !== user.id);
        const newUserFriends = user.userFriends.filter((friendId) => friendId !== user11.id);

        await updateDoc(doc(db, "users", user11.id), {
            userFriends: newUser11Friends,
        });
        await updateDoc(doc(db, "users", user.id), {
            userFriends: newUserFriends,
        });
    };
    if(user11 == null) return <p>Loading...</p>
    // if(!user11)
    if(user.id == user11.id) {
        return (
            <main className="m-p pp">
            <h3>you can't see your profile here</h3>
            <Link  href={"/profile"}>You can see your profile there</Link>
            </main>
        )
    }

    return (
        <main className="m-p">
            {user11 ? (
                <>
                    <div className="userProfile">
                        <div className="dm">
                            <img src={user11?.userPhoto} alt="user photo" />
                        </div>
                        <h3>{user11?.userName}</h3>
                        {!friendMode ? (
                            <button className="btn" onClick={handleBeFriend}>be friends</button>
                        ) : (
                            <button className="btn uB" onClick={handleUnfriend}>unfriend</button>
                        )}
                    </div>

                    <div className="list-of-friends">
                        <h3>your friends</h3>
                        <hr />
                        <div className="list">
                            {friends.map((friend) => (
                                <Link href={`/profile_anther/${friend.id}`} key={friend.id}>
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
                        <h4>her/him number: <b>{user11?.userNum}</b></h4>
                        <hr />
                        <h4>her/him score: <b>{user11?.score}</b></h4>
                        <hr />
                        <h4>she/he have <b>{user11?.userFriends?.length || 0}</b> friends</h4>
                        <hr />
                        <h4>her/him mode: <b>{user11?.mode ? "public" : "private"}</b></h4>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    );
}