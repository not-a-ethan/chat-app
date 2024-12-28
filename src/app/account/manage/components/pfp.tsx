import toast from "react-hot-toast";

import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import styles from "./styles/pfp.module.css";

export default function EditPfp() {
    function changePFP() {
        const input: any = document.getElementById("pfp");
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
            }).then((response) => {
                let json = response.json();
                if (!(response.status >= 200) || !(response.status < 300)) {
                  return response.json().then(Promise.reject.bind(Promise));
                }
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
        }).then((response) => {
            let json = response.json();
            if (!(response.status >= 200) || !(response.status < 300)) {
              return response.json().then(Promise.reject.bind(Promise));
            }
        });

        toast.promise(promise, {
            loading: "Changing pfp",
            error: "Something went wrong, pfp WAS NOT changed",
            success: "Pfp was changed" 
         });
    }

    return (
        <div className={`${styles.componentContainer}`}>
            <Form className={`${styles.container}`}>
                <Input label="New pfp" type="file" id="pfp" className={`${styles.input}`} />

                <Button onPress={changePFP} className={`${styles.button} ${styles.changeButton}`}>Change pfp!</Button>
            </Form>

            <br />

            <Form className={`${styles.container}`}>
                <Button onPress={removePFP} className={`${styles.button}`} color="danger">Remove pfp!</Button>
            </Form>
        </div>
    );
}