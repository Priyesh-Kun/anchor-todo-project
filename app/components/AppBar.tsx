import { FC, useState } from "react"
import styles from "../styles/Home.module.css"
import { Initialize } from "./Initialize"
import { Button } from "@chakra-ui/react"
import { useTodo } from "../hooks/hooks"
import { WalletButton } from "../components/WalletNotConnected"


export interface Props {

}

export const AppBar: FC<Props> = ({ }) => {
  const { initialized, initializeUser, addTask, checkTask, updateTask, deleteTask, incompleteTodos, completedTodos, transactionUrl, todos } = useTodo()

  const [description, setDescription] = useState<string>("")
  const handleInputChange = (event) => {
    setDescription(event.target.value);
  };
  const onClick = async () => {
    addTask(description)
  }
  return (
    <div>
      <div className={styles.AppHeader}>
        <div></div>
        <span>To-do List</span>
        <div>

        {initialized ? (<div className={styles.initialized}>Initialized</div>) : (<Initialize initializeUser={initializeUser} />)}
        <WalletButton />
        </div>
      </div>
      <div className={styles.AddTask}>
        <input
          type="text"
          value={description}
          onChange={handleInputChange}
        />
        <button
          onClick={onClick}
        > Add Task </button>
      </div>
    </div>
  )
}
