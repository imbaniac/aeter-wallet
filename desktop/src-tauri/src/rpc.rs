use jsonrpc_core::MetaIoHandler;

#[derive(Clone)]
pub struct Ctx {
    /// The domain associated with a connection
    pub domain: Option<String>,
}

impl jsonrpc_core::Metadata for Ctx {}

pub struct Handler {
    io: MetaIoHandler<Ctx>,
    ctx: Ctx,
}

impl Handler {
    pub fn new(domain: Option<String>) -> Self {
        // TODO: add handlers
        let res = Self {
            io: MetaIoHandler::default(),
            ctx: Ctx { domain },
        };
        res
    }

    pub async fn handle(&self, request: String) -> Option<String> {
        self.io.handle_request(&request, self.ctx.clone()).await
    }
}
