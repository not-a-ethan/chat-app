import toast from "react-hot-toast";

import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import styles from "./styles/name.module.css";

export default function EditPfp() {
    function changePFP() {
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
               loading: "Changing pfp",
               error: "Something went wrong, pfp WAS NOT changed",
               success: "Pfp was changed" 
            });
        };
        reader.readAsDataURL(newPfp);
    }

    function removePFP() {
        const promise = fetch("../../api/account/changePFP", {
            method: "POST",
            body: JSON.stringify({
                "pfp": null,
                "removing": true
            })
        });

        toast.promise(promise, {
            loading: "Changing pfp",
            error: "Something went wrong, pfp WAS NOT changed",
            success: "Pfp was changed" 
         });
    }

    return (
        <>
            <Form className={`${styles.container}`}>
                <Input label="New pfp" type="file" id="pfp" className={`${styles.input}`} />

                <Button onPress={changePFP} className={`${styles.button}`}>Change pfp!</Button>
            </Form>

            <Form className={`${styles.container}`}>
                <Button onPress={removePFP} className={`${styles.button}`}>Remove pfp!</Button>
            </Form>
        </>
    );
}