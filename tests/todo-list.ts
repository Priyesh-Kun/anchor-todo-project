import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { PublicKey } from "@solana/web3.js";

describe("todo-list", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TodoList as Program<TodoList>;
  const authority = getKeypairFromEnvironment("SECRET_KEY");
  const [userkp, _userBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      authority.publicKey.toBytes(),
      Buffer.from("USER_STATE"),
    ],
    program.programId
  )
  const id = 4;
  const idBuffer = Buffer.alloc(4)
  idBuffer.writeUint32LE(id, 0)

  const [taskKp, _taskBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("TODO_STATE"),
      userkp.toBytes(),
      Buffer.from(id.toString())
    ],
    program.programId
  )

  console.log("This is the user account = ",userkp);
  console.log("This is the taskaccount =", taskKp);

  const account = async (address: PublicKey) => {
    let data = await program.account.task.fetch(address);
    console.log("User Data", data);
  }

  account(new PublicKey("HByZwJrd2VvGppvSNeJqSqgWVGCtRejqhaWJFmJFiGpW"))

  
  // it("Initializing User!", async () => {
    //   // Add your test here.
    //   const tx = await program.methods.initializeUser()
    //     .accounts({
      //       authority: authority.publicKey
      //     })
      //     .signers([authority])
      //     .rpc();
      //   console.log("Your transaction signature", tx);
      // });
      
      it("Creating Task!", async () => {
        // Add your test here.
        const tx = await program.methods.addTask("This is a new task")
        .accounts({
          authority: authority.publicKey,
          owner: userkp,
          taskAccount: taskKp
        })
        .signers([authority])
        .rpc();
        console.log("Your transaction signature", tx);
      });
      
      it("Updating Task!", async () => {
        // Add your test here.
        const tx = await program.methods.updateTask("This is the new description", id)
        .accounts({
          authority: authority.publicKey,
          owner: userkp,
          taskAccount: taskKp
        })
        .signers([authority])
        .rpc();
        console.log("Your transaction signature", tx);
      });
      
      it("Checking Task!", async () => {
        // Add your test here.
        const tx = await program.methods.checkTask(id)
        .accounts({
          authority: authority.publicKey,
          owner: userkp,
          taskAccount: taskKp
        })
        .signers([authority])
        .rpc();
        console.log("Your transaction signature", tx);
      });
      it("Deleting Task!", async () => {
        // Add your test here.
        const tx = await program.methods.deleteTask(id)
        .accounts({
          authority: authority.publicKey,
          owner: userkp,
          taskAccount: taskKp
        })
        .signers([authority])
        .rpc();
        console.log("Your transaction signature", tx);
  });
  account(userkp)
});
