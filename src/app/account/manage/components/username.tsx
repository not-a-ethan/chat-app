import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button"

import toast from "react-hot-toast";

import styles from "./styles/username.module.css";

export default function EditUsername() {
    function changeUsername() {
        const input: HTMLInputElement = document.getElementById("username");
        const newUsername = input.value;

        const promise = fetch("../../api/account/changeUsername", {
            method: "POST",
            body: JSON.stringify({
                "username": newUsername
            })
        }).then(response => console.log(response));

        toast.promise(promise, {
            loading: "Changing username",
            error: "Something went wrong, username WAS NOT changed",
            success: "Username was changed"
        });
    }

    return (
        <>
            <div className={`${styles.container}`}>
                <Input label="New username" type="text" id="username" className={`${styles.input}`} />

                <div className={`${styles.buttonContainer}`}>
                    <Button onPress={changeUsername} className={`${styles.button}`}>Change username!</Button>
                </div>
            </div>
        </>
    );
}