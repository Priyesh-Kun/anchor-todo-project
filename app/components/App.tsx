import { FC } from "react";
import { AppBar } from "./AppBar";
import { AppBody } from "./AppBody";
import styles from "../styles/Home.module.css"


export const App : FC = () => {
    return(
        <div>
            <AppBar></AppBar>
            <AppBody></AppBody>
        </div>
    )
}