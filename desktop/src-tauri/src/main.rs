// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, WindowBuilder, WindowUrl};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![open_new_profile_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
