import { Link } from "@nextui-org/link";

import styles from "./styles/home.module.css";

export default function Home() {
  return (
    <div className={`${styles.all} pageContainer`}>
      <h1>Chat App</h1>

      <p>This is a project by <a href="https://github.com/not-a-ethan">Ethan</a>. This project is a web app that allowed chatting, similer to others such as discord. You can find the code for this project in this <a href="https://github.com/not-a-ethan/chat-app">Github repo</a>.</p>

      <p>This project uses a handful of technolgies, listed below in no particular order</p>
      <ul className={`${styles.list}`}>
        <li>HTML/CSS</li>
        <li>Next.js</li>
        <li>React Hot Toast</li>
        <li>SQLite</li>
      </ul>

      <br />

      <p>You can go to <Link href="/chat">/chat</Link> to start using the app.</p>
    </div>
  );
}
