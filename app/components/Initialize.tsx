import { FC } from "react"
import { Button } from "@chakra-ui/react"
import styles from "../styles/Home.module.css"


export interface Props {
  initializeUser
}

export const Initialize: FC<Props> = ({ initializeUser }) => {

  const onClick = async () => {
    initializeUser()
  }
  return (

    <Button onClick={onClick}>Initialize</Button>
  )
}
