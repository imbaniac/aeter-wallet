// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;

use tauri::{AppHandle, WindowBuilder, WindowUrl};

mod rpc;
mod ws;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let app =
        tauri::Builder::default().invoke_handler(tauri::generate_handler![open_new_profile_window]);

    ws::init().await;

    app.run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
async fn open_new_profile_window(app: AppHandle) -> Result<(), String> {
    let result = WindowBuilder::new(&app, "new_profile", WindowUrl::App("profile/new".into()))
        .fullscreen(false)
        .resizable(false)
        .max_inner_size(400., 500.)
        .title("New Profile")
        .center()
        .build();
    match result {
        Ok(_) => {
            println!("Window Created Successfully!");
            Ok(())
        }
        Err(err) => {
            println!("Failed to Create Window {}", err);
            Err("Failed to create Window".to_string())
        }
    }
}
