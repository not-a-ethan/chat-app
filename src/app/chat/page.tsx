import React from "react";

import styles from "../styles/chat.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.room}>
        <div className={styles.messages}>
          <p>Messages</p>
        </div>

        <div className={styles.people}>
          <p>People in room</p>
        </div>
      </div>
    </>
  );
}
