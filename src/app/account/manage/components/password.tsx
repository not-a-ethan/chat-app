import toast from "react-hot-toast";

import styles from "./styles/password.module.css";

export default function EditPassword() {
    function changePassword() {
        const password: HTMLInputElement = document.getElementById("password");
        const confirm: HTMLInputElement = document.getElementById("confirm");
        const current: HTMLInputElement = document.getElementById("current");
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
        }).then(response => console.log(response));

        toast.promise(promise, {
            loading: "Changing password",
            error: "Something went wrong, password WAS NOT changed",
            success: "Password was changed"
        });
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.inputs}`}>
                <div className={`${styles.newPassword}`}>
                    <label>
                        New password: <input type="password" id="password" className={`${styles.input}`} />
                    </label>

                    <label>
                        Confirm password: <input type="password" id="confirm" className={`${styles.input}`} />
                    </label>
                </div>

                <label>
                    Current password: <input type="password" id="current" className={`${styles.input}`} />
                </label>
            </div>
            

            <button onClick={changePassword} className={`${styles.button}`}>Change password!</button>
        </div>
    );
}