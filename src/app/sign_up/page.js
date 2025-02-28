"use client"
import { useState, useEffect , useContext} from "react"
import { db } from "../firebase/firebase_confage"
import { addDoc, collection, onSnapshot } from "firebase/firestore"
import { UseUser } from "../layout"
import { CldUploadWidget } from "next-cloudinary"

export const uploadPreset = "ilwwehvl"
export default function SignUp() {
    const [users, setUsers] = useState([])
    const [userData, setUserData] = useState({
        userName: "",
        userNum:0 ,
        password: "",
        score: 100,
        userFriends: [],
    })
    const [mode, setMode] = useState(false)
    const [photoUrl, setPhotoUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&usqp=CAU")
    
    useEffect(() => {
        // استماع مباشر لتحديثات مجموعة "users"
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const fetchedUsers = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setUsers(fetchedUsers)
        })

        // إلغاء الاشتراك عند تدمير المكون
        return () => unsubscribe()
    }, [])

    // تنظيف الـ ObjectURL لتجنب التسريبات


    const {user, setUser} = useContext(UseUser)

    const handleSubmit = async () => {
        if (!userData.userName || !userData.userNum || !userData.password) {
            alert("Please fill in all the required fields.")
            return
        }
        else {
            let userAlradyExists = false
            users.forEach((user) => {
                if (user.userNum === userData.userNum) {
                    userAlradyExists = true
                }
            })
            if (userAlradyExists) {
                alert("User already exists")
            }
            else{
                
                const userToken = `user_token,${userData.userNum},${userData.password}`
                await addDoc(collection(db, "users"), {
                    ...userData,
                    mode:mode,
                    userPhoto:photoUrl,
                    userToken:userToken
                })
                alert("user added")
                console.log("done")
                setUser({
                    ...userData,
                    mode:mode,
                    userPhoto:photoUrl,
                    userToken:userToken,
                    userOk:true
                })
                alert("you have signed up, go to chats page")
                setUserData({
                    userName: "",
                    userNum: 0,
                    password: "",
                    score: 100,
                    userFriends:[],
                })
                
                setMode(false)
                localStorage.setItem("user_token", userToken)
                console.log(localStorage.getItem("user_token"))
            }
        }
    }

    console.log(photoUrl)
    return (
        <main className="m-s-u">
            <div className="form">
                <div className="dm">
                    <img src={photoUrl}></img>
                </div>
                <label>Your Name</label>
                <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                    placeholder="Your name"
                />
                <label>Your Number</label>
                <input
                    type="number"
                    name="userNUm"
                    value={userData.userNum}
                    onChange={(e) => setUserData({ ...userData, userNum: e.target.value })}
                    placeholder="Your number"
                />
                <label>Your Password</label>
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    placeholder="Your password"
                />
                <label className="check">
                    <input
                        type="checkbox"
                        checked={mode}
                        onChange={() => setMode(!mode)}
                    />
                    Public Account
                </label>{/*
                <CldUploadButton uploadPreset="ilwwehvl"
    onUpload={(result) => {
        if (result.event === "success") {
            setPhotoId(result.info.secure_url);
            // setUserData({ ...userData, userPhoto: result.info.secure_url });
        }
    }}*/}
    <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(result) => {
    if (result.event === "success") {
        setPhotoUrl(result.info.secure_url);
        console.log(result.info.secure_url)
        // setUserData(prev => ({ ...prev, userPhoto: result.info.secure_url }));
    }
}}>
  {({ open }) => (
    <button className="button" onClick={() => open()}>
      Upload your profile photo
    </button>
  )}
</CldUploadWidget>
                <button onClick={handleSubmit} type="submit" style={{ marginTop: "20px", padding: "10px 20px", background: "#2977F6", color: "#fff", border: "none", borderRadius: "5px" }}>
                    Submit
                </button>
            </div>
        </main>
    )
}