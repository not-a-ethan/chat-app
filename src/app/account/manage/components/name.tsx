export default function EditName() {
    function changeName() {
        const input: HTMLInputElement = document.getElementById("name");
        const newName = input.value;

        fetch("../../api/account/changeName", {
            method: "POST",
            body: JSON.stringify({
                "name": newName
            })
        }).then(response => console.log(response))
    }

    return (
        <>
            <label>
                New name: <input type="text" id="name" />
            </label>

            <button onClick={changeName}>Change name!</button>
        </>
    )
}