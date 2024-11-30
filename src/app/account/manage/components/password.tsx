export default function EditPassword() {
    function changePassword() {
        const password: HTMLInputElement = document.getElementById("password");
        const confirm: HTMLInputElement = document.getElementById("confirm");
        const current: HTMLInputElement = document.getElementById("current");
        const newPassword = password.value;
        const confirmPassword = confirm.value;
        const currentPassowrd = current.value;

        if (newPassword !== confirmPassword) {
            // Error that they do not match
        }

        // Make API request to change password
    }

    return (
        <>
            <label>
                New password: <input type="password" id="password" />
            </label>

            <label>
                Confirm password: <input type="password" id="confirm" />
            </label>

            <label>
                Current password: <input type="password" id="current" />
            </label>

            <button onClick={changePassword}>Change password!</button>
        </>
    )
}