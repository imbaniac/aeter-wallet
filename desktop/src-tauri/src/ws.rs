use std::{collections::HashMap, net::SocketAddr};

use futures_util::{stream::StreamExt, SinkExt};
use once_cell::sync::Lazy;
use tokio::{
    net::{TcpListener, TcpStream},
    sync::{mpsc, RwLock},
};
use tokio_tungstenite::{
    accept_hdr_async,
    tungstenite::{
        handshake::server::{ErrorResponse, Request, Response},
        Message,
    },
    WebSocketStream,
};
use url::Url;

use crate::rpc::Handler;
use crate::ws::peer::{Peer, Peers};

pub mod peer;

static PEERS: Lazy<RwLock<Peers>> = Lazy::new(Default::default);

pub async fn init() {
    tokio::spawn(async { server_loop().await });
    tokio::spawn(async { receiver().await });
}

async fn server_loop() {
    let addr = std::env::var("WS_ENDPOINT").unwrap_or("127.0.0.1:8888".into());
    let listener = TcpListener::bind(&addr).await.expect("Can't connect");

    dbg!("WS server started");

    while let Ok((stream, _)) = listener.accept().await {
        let peer = stream
            .peer_addr()
            .expect("stream should have a perr address");

        tokio::spawn(accept_connection(peer, stream));
    }
}

async fn accept_connection(socket: SocketAddr, stream: TcpStream) {
    let mut query_params: HashMap<String, String> = Default::default();

    let callback = |req: &Request, res: Response| -> Result<Response, ErrorResponse> {
        let url = Url::parse(&format!("{}{}", "http://localhost", req.uri())).unwrap();

        query_params = url.query_pairs().into_owned().collect();
        Ok(res)
    };

    let ws_stream = accept_hdr_async(stream, callback)
        .await
        .expect("Failed to accept");

    let (snd, rcv) = mpsc::unbounded_channel::<serde_json::Value>();
    let url = query_params.get("url").cloned().unwrap_or_default();

    tracing::debug!("Peer {}", url);

    let peer = Peer::new(socket, snd, &query_params);

    PEERS.write().await.add_peer(peer.clone()).await;
    let err = handle_connection(peer, ws_stream, rcv).await;
    PEERS.write().await.remove_peer(socket).await;

    if let Err(e) = err {
        match e {
            WsError::Websocket(e) => match e {
                tungstenite::Error::Utf8
                | tungstenite::Error::ConnectionClosed
                | tungstenite::Error::Protocol(_) => {
                    tracing::debug!("Close {} {:?}", url, e);
                }
                _ => (),
            },
            _ => {
                tracing::error!("Error {} {:?}", url, e);
            }
        }
    }
}

#[derive(thiserror::Error, Debug)]
enum WsError {
    #[error(transparent)]
    Websocket(#[from] tungstenite::Error),

    #[error(transparent)]
    TauriError(#[from] tauri::Error),
}

async fn handle_connection(
    peer: Peer,
    stream: WebSocketStream<TcpStream>,
    mut rcv: mpsc::UnboundedReceiver<serde_json::Value>,
) -> Result<(), WsError> {
    let handler = Handler::new(peer.domain());
    let mut interval = tokio::time::interval(std::time::Duration::from_secs(15));
    let (mut ws_sender, mut ws_receiver) = stream.split();

    loop {
        tokio::select! {
            // RPC request
            msg = ws_receiver.next() =>{
                match msg {
                    Some(msg)=>{
                        let msg = msg?;
                        if let Message::Pong(_) = msg {
                            continue;
                        }
                        let reply = handler.handle(msg.to_string()).await;
                        let reply = reply.unwrap_or_else(||serde_json::Value::Null.to_string());

                        ws_sender.send(reply.into()).await?;
                    },
                    None=>break Ok(())
                }
            }
            // data sent from provider, or event broadcast
            msg = rcv.recv() => {
                match msg {
                    Some(msg) => {
                        ws_sender.send(msg.to_string().into()).await?;
                    },
                    None => {
                        tracing::error!("error from provider or event message receiver");
                        break Ok(())
                    }
                }
            }

            _ = interval.tick() => {
                ws_sender.send(Message::Ping(Default::default())).await?;
            }
        }
    }
}

async fn receiver() {}
