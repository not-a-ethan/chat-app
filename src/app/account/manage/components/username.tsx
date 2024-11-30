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
            <label>
                New username: <input type="text" id="username" />
            </label>

            <button onClick={changeUsername}>Change username!</button>
        </>
    )
}