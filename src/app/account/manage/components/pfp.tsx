import toast from "react-hot-toast";

import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import styles from "./styles/name.module.css";

export default function EditPfp() {
    function changeName() {
        const input: HTMLInputElement = document.getElementById("pfp");
        const newPfp = input.files[0];

        const reader = new FileReader();
        reader.onload = function(e) {
            const image = e.target?.result;

            const promise = fetch("../../api/account/changePFP", {
                method: "POST",
                body: JSON.stringify({
                    "pfp": image,
                    "removing": false
                })
            });
    
            toast.promise(promise, {
               loading: "Changing name",
               error: "Something went wrong, name WAS NOT changed",
               success: "Name was changed" 
            });
        };
        reader.readAsDataURL(newPfp);
    }

    return (
        <>
            <Form className={`${styles.container}`}>
                <Input label="New pfp" type="file" id="pfp" className={`${styles.input}`} />

                <Button onPress={changeName} className={`${styles.button}`}>Change pfp!</Button>
            </Form>
        </>
    );
}