use anchor_lang::prelude::*;

pub mod states;
use crate::states::*;

declare_id!("todofpkYfk3MCiyx4w9JRU67oHyoguYSyyH8BvRKYk5");

#[program]
pub mod todo_list {
    use super::*;

    pub fn initialize_user(
        ctx: Context<InitializeUser>
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.owner;

        user_account.authority = ctx.accounts.authority.key();
        user_account.next_todo = 0;
        user_account.total_todos = 0;

        msg!("User Account Created!");
        Ok(())
    }

    pub fn add_task(ctx: Context<AddTask>, description: String) -> Result<()> {
        let task = &mut ctx.accounts.task_account;
        let user_account = &mut ctx.accounts.owner;
        msg!("Next Todo before creating task {}", user_account.next_todo);
        task.id = user_account.next_todo;
        user_account.next_todo = user_account.next_todo + 1;
        user_account.total_todos = user_account.total_todos + 1;
        task.is_done = false;
        msg!("Next Todo after creating task {}", user_account.next_todo);
        task.owner = ctx.accounts.owner.key();
        task.description = description;

        msg!("Created Task!");
        Ok(())
    }

    pub fn check_task(ctx: Context<CheckTask>, _id: u8) -> Result<()> {
        let task = &mut ctx.accounts.task_account;

        task.is_done = !task.is_done;

        msg!("Checked Task!");
        Ok(())
    }

    pub fn update_task(ctx: Context<UpdateTask>, description: String, _id: u8) -> Result<()> {
        let task = &mut ctx.accounts.task_account;

        task.description = description;

        msg!("Updated Task!");
        Ok(())
    }

    pub fn delete_task(ctx: Context<DeleteTask>, _id: u8) -> Result<()> {
        let user_account = &mut ctx.accounts.owner;
        
        user_account.total_todos -= 1;
        
        msg!("Task Deleted!");
        Ok(())
    }
}

#[derive(Accounts)]
// #[instructions]
pub struct InitializeUser<'info> {
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + UserData::INIT_SPACE,
        seeds=[
            authority.key().as_ref(),
            b"USER_STATE"
        ],
        bump
    )]
    pub owner: Box<Account<'info, UserData>>
}

#[derive(Accounts)]
#[instruction(description: String)]
pub struct AddTask<'info> {
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [
            authority.key().as_ref(),
            b"USER_STATE"
        ],
        bump
    )]
    pub owner: Box<Account<'info, UserData>>,
    #[account(
        init,
        payer = authority,
        space = 8 + Task::INIT_SPACE + description.len(),
        seeds = [
            b"TODO_STATE" ,
            owner.key().as_ref(),
            &owner.next_todo.to_string().as_bytes()    
        ],
        bump,
    )]
    pub task_account: Box<Account<'info, Task>>,
}

#[derive(Accounts)]
#[instruction(id: u8)]
pub struct CheckTask<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [
            authority.key().as_ref(),
            b"USER_STATE"
        ],
        bump
    )]
    pub owner: Box<Account<'info, UserData>>,
    #[account(
        mut,
        seeds = [
            b"TODO_STATE",
            owner.key().as_ref(),
            &id.to_string().as_bytes(),
        ],
        bump,
    )]
    pub task_account: Box<Account<'info, Task>>,
}

#[derive(Accounts)]
#[instruction(description: String, id: u8)]
pub struct UpdateTask<'info> {
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        seeds = [
            authority.key().as_ref(),
            b"USER_STATE"
        ],
        bump
    )]
    pub owner: Box<Account<'info, UserData>>,
    #[account(
        mut,
        realloc = 8 + Task::INIT_SPACE + description.len(),
        realloc::payer = authority,
        realloc::zero = false,
        seeds = [
            b"TODO_STATE",
            owner.key().as_ref(),
            &id.to_string().as_bytes(),
        ],
        bump,
    )]
    pub task_account: Box<Account<'info, Task>>,
}

#[derive(Accounts)]
#[instruction(id: u8)]
pub struct DeleteTask<'info> {
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [
            authority.key().as_ref(),
            b"USER_STATE"
        ],
        bump
    )]
    pub owner: Box<Account<'info, UserData>>,
    #[account(
        mut,
        seeds = [
            b"TODO_STATE",
            owner.key().as_ref(),
            &id.to_string().as_bytes(),
        ],
        bump,
        close = authority,
    )]
    pub task_account: Box<Account<'info, Task>>,
}

