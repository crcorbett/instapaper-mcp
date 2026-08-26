# Instapaper Article Save plugin

This private plugin is the sole Instapaper route for Cooper's reading workflow.
Its remote MCP is `https://instapaper.coopercorbett.com/mcp`. Cloudflare OAuth
asks Cooper to sign in on first connection. The Worker can check Instapaper
without writing; its save tool requires explicit approval for each article and
verifies every successful save by reading it back.
