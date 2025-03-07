"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "./coms/head";
import Loading from "./loading";
import { createContext, useEffect, useState } from "react";
import { db } from "./firebase/firebase_confage";
import { collection, onSnapshot } from "firebase/firestore"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const UseUser = createContext(null);
export const matadata = {
  title: "Funny Chat",
  description: "Funny Chat is a chat app that allows you to chat with your friends",
  icons:{
    icon:"./logo.svg"
  }
};
export default function RootLayout({ children }) {
  const [user, setUser] = useState({
    userOk: false,
    userName: "o",
    userNum: 0,
    password: " ",
    score: 100,
    userPhoto: " ",
    mode: false,
    userToken: " ",
    userFriends: [],
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    const loginWithToken = () => {
      setLoading(true);

      const userDataToken = localStorage.getItem("user_token");
      if (!userDataToken) {
        setLoading(false);
        return;
      }

      const tokenParts = userDataToken.split(",");
      if (tokenParts.length < 3 || tokenParts[0] !== "user_token") {
        setLoading(false);
        return;
      }

      const foundUser = users.find(
        (user) => user.userNum == tokenParts[1] && user.password == tokenParts[2]
      );

      if (foundUser) {
        setUser({ ...foundUser, userOk: true });
      } else {
        alert("User not found");
      }

      setLoading(false);
    };

    loginWithToken();
  }, [users]);

  return (
    <html lang="en">
      <UseUser.Provider value={{ user, setUser }}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Head />
          {loading ? <Loading /> : children}
        </body>
      </UseUser.Provider>
    </html>
  );
}