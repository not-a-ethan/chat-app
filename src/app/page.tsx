'use client'

import { Link } from "@nextui-org/link";

import styles from "./styles/home.module.css";

export default function Page() {
  return (
    <div className={`${styles.all} pageContainer prose prose-headings:font-serif`}>
      <h1>Chat App</h1>

      <p>This is a project by <a href="https://github.com/not-a-ethan">Ethan</a>. This project is a web app that allowed chatting, similer to others such as discord. You can find the code for this project in this <Link href="https://github.com/not-a-ethan/chat-app">Github repo</Link>.</p>

      <br />
      <br />

      <div className={`${styles.container}`}>
        <div className={`${styles.left}`}>
          <h2>Technologies used</h2>
          <p>This project uses a handful of technolgies, listed below in no particular order</p>

          <ul className={`${styles.list}`}>
            <li>HTML/CSS</li>
            <li>Next.js</li>
            <li>React Hot Toast</li>
            <li>SQLite</li>
            <li>NextUI</li>
          </ul>
        </div>

        <div className={`${styles.right}`}>
          <h2><Link href="/chat">/chat</Link></h2>
          <p>That route is where you can chat. This includes interacting with messages, creating rooms, etc</p>

          <br />

          <h2><Link href="/account/manage">/account/manage</Link></h2>
          <p>This is where you can manage your account. This includes changing your username and other settings.</p>
        </div>
      </div>
    </div>
  );
}
