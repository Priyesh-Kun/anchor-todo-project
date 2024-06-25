use anchor_lang::prelude::*;


#[account]
pub struct Task {
    pub owner: Pubkey,
    pub is_done: bool,
    pub description: String,
    pub id: u8,
}

impl Space for Task {
    const INIT_SPACE: usize = 32 + 1 + 8;
}

#[account]
pub struct UserData {
    pub authority: Pubkey,
    pub next_todo: u8,
    pub total_todos: u8,
}

impl Space for UserData {
    const INIT_SPACE: usize = 32 + 8 + 8;
}
