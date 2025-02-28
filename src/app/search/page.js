"use client"
import { useState, useEffect, useContext } from "react"
import { UseUser } from "../layout"
import { db } from "../firebase/firebase_confage"
import { collection, onSnapshot } from "firebase/firestore"
import Link from "next/link"
export default function Search() {
    const [searchP, setSearchP] = useState("")
    const { user } = useContext(UseUser)
    const [search, setSearch] = useState("")
    const [resSearch, setResSearch] = useState([])
    const [resP, setResP] = useState([])
    const [privateUsers, setPrivateUsers] = useState([])
    const [piplucUsers, setPiplucUsers] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const fetchedUsers = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            // تقسيم المستخدمين حسب mode
            setPrivateUsers(fetchedUsers.filter(user1 => !user1.mode && user1.userNum != user.userNum));
            setPiplucUsers(fetchedUsers.filter(user1 => user1.mode && user1.userNum != user.userNum));
        });

        return () => unsubscribe();
    }, []);

    if (!user) return <p>Loading...</p>

    const handleSearch = () => {
        const results = piplucUsers.filter(user => 
            user.userName.toLowerCase().includes(search.toLowerCase().trim()) || 
            user.userNum.toString().includes(search)
        );
        setResSearch(results);
    };

    
const handleSearchP = () => {
        const result = privateUsers.filter(user => 
            user.userNum === searchP
        );
        console.log(result)
        setResP([...result]);
    }
    return (
        <main className="m-p">
            <div className="search-bar s">
                <input  
                    value={search} 
                    type="text" 
                    placeholder="Search for friends" 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <button onClick={handleSearch} className="btn s-btn">Search</button>
            </div>
            <div className="result-of-search s list-of-friends">
                <h3>Result of search</h3>
                <div className="list">
                    <hr/>
                    {resSearch.map(user => (
                        <Link href={`/profile_anther/${user.id}`}>
                        <div key={user.id} className="friend">
                            <div className="dm wd">
                                <img src={user.userPhoto} alt={user.userName}></img>
                            </div>
                            <div className="friend-info">
                                <h4>{user.userName}</h4>
                                <h5>{user.userNum}</h5>
                            </div>
                        </div>
                        </Link>
                    ))}
                </div>

            </div>
            <div className="list-of-friends">
                <h3>Some Suggests</h3>
                <div className="list">
                    <hr/>
                    {piplucUsers.map((user) => (
                        <Link href={`/profile_anther/${user.id}`} key={user.id}>
                            <div className="friend">
                                <div className="dm wd">
                                    <img src={user.userPhoto} alt={user.userName}></img>
                                </div>
                                <div className="friend-info">
                                    <h4>{user.userName}</h4>
                                    <h5>{user.userNum}</h5>
                                </div>
                            </div>
                        </Link>
                    )
                    )}
                </div>
            </div>
            <hr></hr>
            <hr></hr>
                <h1>search in private Accounts</h1>
            <div className="list-of-friends search-bar">
                <input  
                    value={searchP} 
                    type="numbar" 
                    placeholder="Search for friends" 
                    onChange={(e) => setSearchP(e.target.value)} 
                />

                <button onClick={handleSearchP} className="btn s-btn">Search</button>
            </div>
            <div className="result-of-search s list-of-friends">
                <h3>Result of search</h3>
                <div className="list">
                    <hr/>
                    {resP.map((user)=> (
                        <Link href={`profile_anther/${user.id}`}>
                            <div key={user.id} className="friend">
                                <div className="dm wd">
                                    <img src={user.userPhoto} alt={user.userName}></img>
                                </div>
                                <div className="friend-info">
                                    <h4>{user.userName}</h4>
                                    <h5>{user.userNum}</h5>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}