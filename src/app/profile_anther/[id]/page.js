"use client";
import { useState, useEffect, useContext, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase/firebase_confage";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { UseUser } from "@/app/layout";
import Link from "next/link"
import Loder from "@/app/coms/loder";
import SH from "@/app/coms/should_log";
export default function Anther_Profile() {
    const { user } = useContext(UseUser);
    const { id } = useParams();
    const router = useRouter();
    const [user11, setUser11] = useState(null);
    const [friendMode, setFriendMode] = useState(false);
    const [friends, setFriends] = useState([]);
    if(user.userOk === false) return (<SH/>)
    // جلب بيانات المستخدم
    useEffect(() => {
        if (!id) return;
        const getUser = async () => {
            try {
                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser11({ ...docSnap.data(), id: docSnap.id });
                } else {
                    setUser11("not-found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser11("not-found");
            }
        };
        getUser();
    }, [id]);

    // جلب بيانات الأصدقاء
    useEffect(() => {
        if (!user11 || !user11.userFriends) return;
        setFriends([]); // إعادة تعيين القائمة عند كل تحديث

        const unsubscribes = user11.userFriends.map((friendId) => {
            const docRef = doc(db, "users", friendId);
            return onSnapshot(docRef, (doc) => {
                if (doc.exists() && (doc.data().mode || doc.id === user.id)) {
                    setFriends((prevFriends) => {
                        const alreadyExists = prevFriends.some(f => f.id === doc.id);
                        return alreadyExists ? prevFriends : [...prevFriends, { ...doc.data(), id: doc.id }];
                    });
                }
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [user11]);

    // تحديث وضع الصداقة
    useEffect(() => {
        if (!user11 || friends.length === 0) return;
        setFriendMode(friends.some((friend) => friend.id === user.id));
    }, [friends, user11]);

    // إضافة صديق
    const handleBeFriend = async () => {
        if (friendMode) return alert("You are already friends with this user");

        if (!user11?.userFriends || !user?.userFriends) {
            return alert("Error: userFriends data is not loaded yet.");
        }

        setFriendMode(true);

        await updateDoc(doc(db, "users", user11.id), {
            userFriends: [...(user11.userFriends || []), user.id],
        });
        await updateDoc(doc(db, "users", user.id), {
            userFriends: [...(user.userFriends || []), user11.id],
        });

        alert("You are now friends with this user");
        router.push(`/profile_anther/${user11.id}`);
    };

    // إزالة صديق
    const handleUnfriend = async () => {
        if (!user11?.userFriends || !user?.userFriends) {
            return alert("Error: userFriends data is not loaded yet.");
        }

        setFriendMode(false);

        const newUser11Friends = (user11.userFriends || []).filter((friendId) => friendId !== user.id);
        const newUserFriends = (user.userFriends || []).filter((friendId) => friendId !== user11.id);

        await updateDoc(doc(db, "users", user11.id), { userFriends: newUser11Friends });
        await updateDoc(doc(db, "users", user.id), { userFriends: newUserFriends });

        alert("You unfriended");
        router.push(`/profile_anther/${user11.id}`);
    };

    // تحميل البيانات
    if (user11 === null) return <p>Loading...</p>;
    if (user11 === "not-found") return <p>User not found</p>;

    // منع عرض بروفايل المستخدم نفسه هنا
    if (user.id === user11.id) {
        return (
            <main className="m-p pp">
                <h3>You can't see your profile here</h3>
                <Link href={"/profile"}>You can see your profile there</Link>
            </main>
        );
    }
    if(user.userOK == false) (
        <>
            you should go to <Link style={{
                color:"blue"  
            }} href={"/log_in"}>log in</Link>
            or <Link style={{
                color:"blue"
            }} href={"/sign_up"}>sign_up</Link>
        </>
    )
    return (
        <Suspense fallback={<Loder/>}>
        <main className="m-p">
            <div className="userProfile">
                <div className="dm">
                    <img src={user11?.userPhoto} alt="user photo" />
                </div>
                <h3>{user11?.userName}</h3>
                {!friendMode ? (
                    <button className="btn" onClick={handleBeFriend}>Be friends</button>
                ) : (
                    <button className="btn uB" onClick={handleUnfriend}>Unfriend</button>
                )}
            </div>

            <div className="list-of-friends">
                <h3>Her/Him Friends</h3>
                <hr />
                <div className="list">
                    {friends.map((friend) => (
                        <Link href={`/profile_anther/${friend.id}`} key={friend.id}>
                            <div className="friend">
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
                <h4>Her/Him Number: <b>{user11?.userNum}</b></h4>
                <hr />
                <h4>Her/Him Score: <b>{user11?.score}</b></h4>
                <hr />
                <h4>She/He Has <b>{user11?.userFriends?.length || 0}</b> Friends</h4>
                <hr />
                <h4>Her/Him Mode: <b>{user11?.mode ? "Public" : "Private"}</b></h4>
            </div>
        </main>
        </Suspense>
    );
}