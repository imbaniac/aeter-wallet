use std::{collections::HashMap, net::SocketAddr};

use tokio::sync::mpsc;

#[derive(Clone)]
pub struct Peer {
    pub origin: String,
    pub favicon: Option<String>,
    pub url: Option<String>,
    pub tab_id: Option<u32>,
    pub title: Option<String>,
    pub socket: SocketAddr,
    pub sender: mpsc::UnboundedSender<serde_json::Value>,
}

impl Peer {
    pub fn new(
        socket: SocketAddr,
        sender: mpsc::UnboundedSender<serde_json::Value>,
        query_params: &HashMap<String, String>,
    ) -> Self {
        let origin = query_params
            .get("origin")
            .cloned()
            .unwrap_or("unknown".into());
        let url = query_params.get("url").cloned();
        let favicon = query_params.get("favicon").cloned();
        let tab_id = query_params
            .get("tabId")
            .cloned()
            .and_then(|id| id.parse().ok());
        let title = query_params.get("title").cloned();

        Self {
            origin,
            favicon,
            url,
            tab_id,
            title,
            socket,
            sender,
        }
    }

    pub fn domain(&self) -> Option<String> {
        self.url.as_ref().and_then(|url| {
            url.parse::<url::Url>()
                .ok()
                .and_then(|url| url.host_str().map(|s| s.to_owned()))
        })
    }
}

#[derive(Default)]
pub struct Peers {
    map: HashMap<SocketAddr, Peer>,
}

impl Peers {
    pub async fn add_peer(&mut self, peer: Peer) {
        self.map.insert(peer.socket, peer);
        // TODO: notify UI about new connection
    }

    pub async fn remove_peer(&mut self, peer: SocketAddr) {
        self.map.remove(&peer);
        // TODO: notify UI about removed connection
    }
}
