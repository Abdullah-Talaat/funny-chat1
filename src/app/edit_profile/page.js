"use client"
import { useContext, useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { UseUser } from "../layout"
import { db } from "../firebase/firebase_confage"
import { doc, updateDoc } from "firebase/firestore"
import { uploadPreset } from "../sign_up/page"

export default function EditProfile() {
    const { user } = useContext(UseUser);
    const [userData, setUserData] = useState({
        userName: user.userName,
        userPhoto: user.userPhoto,
        mode: user.mode
    });
    const [photoUrl, setPhotoUrl] = useState(user.userPhoto);

    const handleUpload = async (result) => {
        const newPhotoUrl = result.info.secure_url;
        setPhotoUrl(newPhotoUrl);
        setUserData({ ...userData, userPhoto: newPhotoUrl });

        // تحديث صورة المستخدم في Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            userPhoto: newPhotoUrl
        });
    };
    console.log(uploadPreset)
    return (
        <main className="m-p">
            <div className="s">
                <div className="dm">
                    <img src={photoUrl} alt="User Profile"></img>
                </div>
                <CldUploadWidget 
                    uploadPreset={uploadPreset} 
                    onSuccess={handleUpload} 
                    
                >
                    <button onClick={(open) => open()} type="submit" style={{ marginTop: "20px", padding: "10px 20px", background: "#2977F6", color: "#fff", borderRadius: "5px" }}>
                        update image
                    </button>
                </CldUploadWidget>
                
            </div>
        </main>
    );
}