"use client"
import { useEffect, useContext, useState, use } from "react"
import { UseUser } from "../layout";
import { CldUploadWidget } from "next-cloudinary";
import { uploadPreset } from "../sign_up/page";
import SH from "../coms/should_log";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase_confage";
export default function Edit_profile() {
    const {user} = useContext(UseUser)
    if(!user.userOk){
        return <SH/>
    }
    const [userData, setUserData] = useState({
        userName: user.userName,
        userMode: user.mode
    })
    const [mode, setMode] = useState(false)
    const [photoUrl, setPhotoUrl] = useState(user.userPhoto)
    
    return (
        <main className="m-l-in" style={{
            flexDirection:"column",
            justifyContent:"space-around",
            height:"80%"
        }}>
            <title>edit profileŕ</title>
            <div className="share-app" style={{
                flexDirection:"column",
                margin:"20px"
            }}>
                <h3>{user.userName}</h3>
                <p style={{
                    fontSize:"15px",
                    color:"#888"
                }}>{user.userNum}</p>
                <div className="profile-photo dm">
                    <img src={user.userPhoto} alt="user photo"></img>
                </div>
            </div>
            <div className="share-app">
                <div style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center"
                }}>
                <div className="dm">
                    <img src={photoUrl}/>
                </div>
                <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(result) => {

                    result.event = "success"? setPhotoUrl(result.info.secure_url) : alert("thth")
                }}>
                    {({ open }) => (<button onClick={open}>Change photo</button>)}
                </CldUploadWidget>
                </div>
            </div>
            <div className="share-app m-10">
                <input className="input" type="text" placeholder="name" value={userData.userName} onChange={(e) => setUserData({...userData, userName: e.target.value})}/>
                <h3>{userData.userName}</h3>
            </div>
            <div className="share-app m-10">
                <button className="btn" onClick={() => setMode(!mode)}>{mode ? "public" : "private"}// change mode</button>
                <hr></hr>
                <button className="btn m-5" onClick={() => {
                    if(userData.userName != "" || userData.userName != user.userName || mode != user.mode || photoUrl != user.userPhoto ){
                      updateDoc(doc(db, "users", user.id), {
                        userName: userData.userName,
                        mode: mode,
                        userPhoto: photoUrl
                    }).then(() => {
                        alert("profile updated")
                        window.location.href = "/profile"
                    })
                    if(userData.userName == user.userName || mode == user.mode || photoUrl == user.userPhoto){
                        alert("no changes")
                    }
                }}}>save Changes</button>
            </div>
        </main>
    )
    
}