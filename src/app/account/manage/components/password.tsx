import toast from "react-hot-toast";

import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import styles from "./styles/password.module.css";

export default function EditPassword() {
    function changePassword() {
        const password: any = document.getElementById("password");
        const confirm: any = document.getElementById("confirm");
        const current: any = document.getElementById("current");
        const newPassword = password.value;
        const confirmPassword = confirm.value;
        const currentPassowrd = current.value;

        if (newPassword !== confirmPassword) {
            toast.error("New and old passwords are the same.");
            return;
        }

        const promise = fetch("../../api/account/changePassword", {
            method: "POST",
            body: JSON.stringify({
                "password": newPassword,
                "currentPassword": currentPassowrd
            })
        });

        toast.promise(promise, {
            loading: "Changing password",
            error: "Something went wrong, password WAS NOT changed",
            success: "Password was changed"
        });
    }

    return (
        <Form className={`${styles.container}`}>
            <div className={`${styles.inputs}`}>
                <div className={`${styles.newPassword}`}>
                    <Input label="New password" type="password" id="password" className={`${styles.input}`} />

                    <Input label="Confirm password" type="password" id="confirm" className={`${styles.input}`} />
                </div>

                <Input label="Current password" type="password" id="current" className={`${styles.input}`} />
            </div>
            

            <Button onPress={changePassword} className={`${styles.button}`}>Change password!</Button>
        </Form>
    );
}