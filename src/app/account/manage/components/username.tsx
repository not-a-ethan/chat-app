import toast from "react-hot-toast";

import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import styles from "./styles/username.module.css";

export default function EditUsername() {
    function changeUsername() {
        const input: any = document.getElementById("username");
        const newUsername = input.value;

        const promise = fetch("../../api/account/changeUsername", {
            method: "POST",
            body: JSON.stringify({
                "username": newUsername
            })
        }).then((response) => {
            let json = response.json();
            if (!(response.status >= 200) || !(response.status < 300)) {
              return response.json().then(Promise.reject.bind(Promise));
            }
        });

        toast.promise(promise, {
            loading: "Changing username",
            error: "Something went wrong, username WAS NOT changed",
            success: "Username was changed"
        });
    }

    return (
        <>
            <Form className={`${styles.container}`}>
                <Input label="New username" type="text" id="username" className={`${styles.input}`} />

                <div className={`${styles.buttonContainer}`}>
                    <Button onPress={changeUsername} className={`${styles.button}`}>Change username!</Button>
                </div>
            </Form>
        </>
    );
}