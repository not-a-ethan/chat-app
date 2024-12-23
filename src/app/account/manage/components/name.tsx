import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button"

import toast from "react-hot-toast";

import styles from "./styles/name.module.css";

export default function EditName() {
    function changeName() {
        const input: HTMLInputElement = document.getElementById("name");
        const newName = input.value;

        const promise = fetch("../../api/account/changeName", {
            method: "POST",
            body: JSON.stringify({
                "name": newName
            })
        }).then(response => console.log(response));

        toast.promise(promise, {
           loading: "Changing name",
           error: "Something went wrong, name WAS NOT changed",
           success: "Name was changed" 
        });
    }

    return (
        <>
            <Form className={`${styles.container}`}>
                <Input label="New name" type="text" id="name" className={`${styles.input}`} />

                <Button onPress={changeName} className={`${styles.button}`}>Change name!</Button>
            </Form>
        </>
    );
}