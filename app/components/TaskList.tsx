import { FC, useEffect } from "react"
import { TaskItem } from "./TaskItem"
import styles from "../styles/Home.module.css"


export interface Props {
    checkTask,
    updateTask,
    deleteTask,
    todos
}


export const TaskList: FC<Props> = ({ checkTask, updateTask, deleteTask, todos}) => {
    useEffect(()=>{})
    return (<ul className="task-list">
        {todos.map((todo)=>(
            <TaskItem
            key={todo.account.id}
                idx={todo.account.id}
                checkTask={checkTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                description={todo.account.description}
                isDone={todo.account.isDone}
            />
        ))}
    </ul>)
}