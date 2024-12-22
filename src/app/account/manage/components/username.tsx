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
                <label>
                    New username: <input type="text" id="username" className={`${styles.input}`} />
                </label>

                <div className={`${styles.buttonContainer}`}>
                    <button onClick={changeUsername} className={`${styles.button}`}>Change username!</button>
                </div>
            </div>
        </>
    );
}