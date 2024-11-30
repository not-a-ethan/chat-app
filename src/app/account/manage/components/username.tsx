export default function EditUsername() {
    function changeUsername() {
        const input: HTMLInputElement = document.getElementById("username");
        const newUsername = input.value;

        // Make API request to change username
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