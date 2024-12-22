import styles from "./styles/name.module.css";

export default function EditName() {
    function changeName() {
        const input: HTMLInputElement = document.getElementById("name");
        const newName = input.value;

        fetch("../../api/account/changeName", {
            method: "POST",
            body: JSON.stringify({
                "name": newName
            })
        }).then(response => console.log(response));
    }

    return (
        <>
            <div className={`${styles.container}`}>
                <label>
                    New name: <input type="text" id="name" className={`${styles.input}`} />
                </label>

                <br />

                <div className={`${styles.buttonContainer}`}>
                    <button onClick={changeName} className={`${styles.button}`}>Change name!</button>
                </div>
            </div>
        </>
    );
}