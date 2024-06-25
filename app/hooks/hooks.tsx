import {
    useConnection,
    useAnchorWallet
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor"
import {
    useEffect,
    useMemo,
    useState
} from "react";
import idl from "../idl.json"
import { SystemProgram } from "@solana/web3.js";

export function useTodo() {
    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()

    const [program, setProgram] = useState<anchor.Program>()
    const [owner, setOwner] = useState<string>()
    const [ownerInfo, setOwnerInfo] = useState<anchor.AccountClient | null>()
    const [nextTodo, setNextTodo] = useState<number>()
    const [initialized, setInitialized] = useState<boolean>(false)
    const [todos, setTodos] = useState([])
    const [transactionUrl, setTransactionUrl] = useState<string>("")

    const authorFilter = (authorBase58PublicKey) => ({
        memcmp: {
            offset: 8, // Discriminator.
            bytes: authorBase58PublicKey,
        },
    })

    useEffect(() => {
        let provider: anchor.Provider

        try {
            provider = anchor.getProvider()
        } catch {
            provider = new anchor.AnchorProvider(connection, anchorWallet, {})
            anchor.setProvider(provider)
        }

        const program = new anchor.Program(idl as anchor.Idl)

        const [owner, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                anchorWallet.publicKey.toBytes(),
                Buffer.from("USER_STATE"),
            ],
            program.programId
        )

        const account = async () => {
            let ownerInfo: anchor.AccountClient = await program.account.userData.fetchNullable(owner)
            let todoAccounts = await program.account.task.all([authorFilter(owner.toBase58())])

            if (ownerInfo === null) {
                setInitialized(false)
            }
            else {
                setInitialized(true)
                setNextTodo(ownerInfo.nextTodo)
                setOwnerInfo(ownerInfo)
                setTodos(todoAccounts)
            }
        }

        account()
        setOwner(owner.toBase58())
        setProgram(program)
    },[])

    const initializeUser = async () => {
        const sig = await program.methods
            .initializeUser()
            .accounts({
                
                authority: anchorWallet.publicKey,
                owner: new anchor.web3.PublicKey(owner)
            })
            .rpc()
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    }

    const addTask = async (description: string) => {
        const ownerKp = new anchor.web3.PublicKey(owner)
        const [taskAccount, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("TODO_STATE"),
                ownerKp.toBytes(),
                Buffer.from(nextTodo.toString())
            ],
            program.programId
        )
        const sig = await program.methods
            .addTask(description)
            .accounts({
                
                authority: anchorWallet.publicKey,
                owner: ownerKp,
                taskAccount: taskAccount,
            })
            .rpc()
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    }

    const updateTask = async (description: string, id: number) => {
        const ownerKp = new anchor.web3.PublicKey(owner)
        const [taskAccount, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("TODO_STATE"),
                ownerKp.toBytes(),
                Buffer.from(id.toString())
            ],
            program.programId
        )
        const sig = await program.methods
            .updateTask(description,id)
            .accounts({
                
                authority: anchorWallet.publicKey,
                owner: ownerKp,
                taskAccount: taskAccount,
            })
            .rpc()
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    }

    const checkTask = async (id: number) => {
        const ownerKp = new anchor.web3.PublicKey(owner)
        const [taskAccount, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("TODO_STATE"),
                ownerKp.toBytes(),
                Buffer.from(id.toString())
            ],
            program.programId
        )
        const sig = await program.methods
            .checkTask(id)
            .accounts({
                authority: anchorWallet.publicKey,
                owner: ownerKp,
                taskAccount: taskAccount,
            })
            .rpc()
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    }
    
    const deleteTask = async (id: number) => {
        const ownerKp = new anchor.web3.PublicKey(owner)
        const [taskAccount, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("TODO_STATE"),
                ownerKp.toBytes(),
                Buffer.from(id.toString())
            ],
            program.programId
        )
        const sig = await program.methods
        .deleteTask(id)
        .accounts({
            
            authority: anchorWallet.publicKey,
            owner: ownerKp,
            taskAccount: taskAccount,
        })
        .rpc()
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    }

    const incompleteTodos = useMemo(() => todos.filter((todo) => !todo.account.isDone), [todos])
    const completedTodos = useMemo(() => todos.filter((todo) => todo.account.isDone), [todos])

    return { initialized, initializeUser, addTask, checkTask, updateTask, deleteTask, incompleteTodos, completedTodos, transactionUrl, todos }
}