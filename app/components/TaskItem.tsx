import { FC, useEffect, useState } from "react"
import { HStack } from "@chakra-ui/react"
import styles from "../styles/Home.module.css"

export interface Props{
    idx:number,
    checkTask,
    updateTask,
    deleteTask,
    description,
    isDone
}



export const TaskItem: FC<Props> = ({idx, checkTask, updateTask, deleteTask, description, isDone }) => {
    const [content, setContent] = useState()
    useEffect(()=>{
        setContent(description)
    },[0])
    const handleCheckTask = () => {
        checkTask(idx)
    }

    const handleDeleteTask = () => {
        deleteTask(idx)
    }
    const handleUpdateTask = (event) => {
        updateTask(content, idx);
      };
      const handleInputChange = (event) => {
        setContent(event.target.value);
      };
    
    
    return (<li key={idx} className="task-item">
        <HStack>
            <input
                value={content}
                onChange={handleInputChange}
                className={styles.content}
            />
            {!isDone ? (<button className={styles.Utils}onClick={handleCheckTask}>Check</button>): (<div></div>)}
            <button className={styles.Utils} onClick={handleUpdateTask}>Update</button>
            <button className={styles.Utils} onClick={handleDeleteTask}>Delete</button>
        </HStack>
        <hr/>
    </li>)
}