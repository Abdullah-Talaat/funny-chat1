"use client"
import { useState, useEffect, useContext } from "react"
import { UseUser } from "../layout"
import { db } from "../firebase/firebase_confage"
import { where, collection, onSnapshot } from "firebase/firestore"
import { decode, encode } from "../sign_up/replacer"
export default function LogIn() {
    const [userLoginData, setUserLoginData] = useState({
        userNum: 0,
        password: "",
    })
    const { setUser } = useContext(UseUser)

    const [users , setUsers] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const fetchedUsers = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setUsers(fetchedUsers)

            return () => unsubscribe()
        })
    }, [])
    

    const handleSubmit = () => {
        if (userLoginData.userNum == null || userLoginData.password == "") {
            alert("Please fill in all the required fields.")
            return
        }
        else {
            let userFound  = false
            let userData = {}
            users.forEach((user)=> {
                if (user.userNum == userLoginData.userNum && user.password == userLoginData.password) {
                    userFound = true
                    userData = user
                    
                }
            })
            if (userFound) {
                localStorage.setItem("user_token", userData.userToken)
                
                setUser({
                    userNum: userData.userNum,
                    userName: userData.userName,
                    userPhoto: userData.userPhoto,
                    userFriends: userData.userFriends,
                    score: userData.score,
                    mode: userData.mode,
                    id:userData.id,
                    userOk:true
                })
                setUserLoginData({
                    userNum: 0,
                    password: "",   
                })
                alert("done")
                window.location.href = "/chats"
            }
            else {
                alert("user not found")
            }
        }
    }
    
    return (
        <main className="m-l-in">
            <title>log in</title>
            <div className="form">
                <input type="number" name="userNum" value={userLoginData.userNum} onChange={(e) => setUserLoginData({ ...userLoginData, userNum: e.target.value })} placeholder="Your number" />
                <input type="password" name="password" value={userLoginData.password} onChange={(e) => setUserLoginData({ ...userLoginData, password: e.target.value })} placeholder="Your password" />
                <button type="submit" style={{ marginTop: "20px", padding: "10px 20px", background: "#2977F6", color: "#fff", border: "none", borderRadius: "5px" }}
                onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </main>
    )
}