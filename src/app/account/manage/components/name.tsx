export default function EditName() {
    function changeName() {
        const input: HTMLInputElement = document.getElementById("name");
        const newName = input.value;

        // Make API request to change username
    }

    return (
        <>
            <label>
                New username: <input type="text" id="name" />
            </label>

            <button onClick={changeName}>Change name!</button>
        </>
    )
}