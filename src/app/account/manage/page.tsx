'use client'

import { useRouter } from 'next/navigation';

import { useSession } from "next-auth/react";

import EditUsername from "./components/username";
import EditPassword from "./components/password";
import EditName from "./components/name";
import EditPfp from "./components/pfp";

import styles from "./manage.module.css";

export default function Manage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
      return (<p>Loading</p>);
  }
  
  if (status === "unauthenticated") {
      router.replace("/api/auth/signin");
      return (<p>Access Denied</p>);
  }

  return (
    <div className={`${styles.pageContainer}`}>
      <h1 className={`${styles.exlcude}`}>Settings!</h1>

      <p className={`${styles.exlcude}`}>Here you can change your account settings</p>

      <EditUsername />
      <br />
      <EditPassword />
      <br />
      <EditPfp />
      <br />
      <EditName />
    </div>
  );
};