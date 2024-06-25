import { FC } from "react";
import styles from "../styles/Home.module.css";
import { TaskList } from "./TaskList";
import { useTodo } from "../hooks/hooks"

export const AppBody: FC = () => {
  const { initialized, initializeUser, addTask, checkTask, updateTask, deleteTask, incompleteTodos, completedTodos, transactionUrl, todos } = useTodo()
  return (
    <div className={styles.AppBody}>
      <div>
        <span>Incomplete Tasks</span>
        <TaskList
          checkTask={checkTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          todos={incompleteTodos}
          />
      </div>
      <div></div>
      <div>
          <span>Completed Tasks</span>
        <TaskList
          checkTask={checkTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          todos={completedTodos}
        />
      </div>

    </div>
  )

}