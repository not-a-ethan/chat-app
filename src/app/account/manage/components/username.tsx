import styles from "./styles/username.module.css"

export default function EditUsername() {
    function changeUsername() {
        const input: HTMLInputElement = document.getElementById("username");
        const newUsername = input.value;

        fetch("../../api/account/changeUsername", {
            method: "POST",
            body: JSON.stringify({
                "username": newUsername
            })
        }).then(response => console.log(response))
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
    )
}