import { NextPage } from "next"
import styles from "../styles/Home.module.css"
import {App} from "../components/App"
import { useWallet} from "@solana/wallet-adapter-react"
import { useState } from "react"
import { WalletButton } from "../components/WalletNotConnected"


const Home: NextPage = (props) => {
  const [initialized, setInitialized] = useState()
  const wallet = useWallet()


  return (
    <div className={styles.body}>
      {(wallet.connected ? (<App />) : (<div className={styles.walletNotConnect}> <WalletButton /> </div>))}
      
    </div>
  )
}

export default Home
