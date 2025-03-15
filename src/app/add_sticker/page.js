"use client"
import { db } from "../firebase/firebase_confage"
import { collection, addDoc} from "firebase/firestore"
import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { uploadPreset } from "../sign_up/page"
export default function Add_Sticker() {
    const password1 = "m-aa-111222444"
    const [sticker ,setSticker ] = useState({
        name:"",
        url:"",
        score:0
    })
    const [password,setPassword] = useState("")
    return (

        <main>
                <title>add sticker</title>
            
            <input onChange={(e)=>setPassword(e.target.value)}  value = {password} className="input" placeholder="add password"></input>
            <input className="input" value={sticker.name} onChange={(e)=>setSticker({...sticker, name:e.target.value})} placeholder="add name"></input>
            <input className="input" value={sticker.score} onChange={(e)=>setSticker({...sticker, score:e.target.value})} placeholder="add score"></input>
            
            <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(result) => {
                
                result.event === "success" ? setSticker({...sticker, url:result.info.secure_url}) : //("thth")
            }}>
                {({open})=>(
                    <button onClick={open}>upload sticker</button>
                )}   
            </CldUploadWidget>
            <img style={{
                width:"100px",
                height:"100px"
            }} src={sticker.url}/>
            <button  className="btn" type="submit" onClick={()=>{if(password === password1 && sticker.score != 0  && sticker.url != "" && sticker.name != "" ){ addDoc(collection(db, "stickers_level_1"), sticker)
                alert("sticker added")
                setSticker({name:"",url:"",score:0}) }else{ alert("wrong password")}}}>add sticker</button>
        </main>
    )
}
