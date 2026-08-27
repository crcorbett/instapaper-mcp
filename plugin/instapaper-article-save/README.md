# Instapaper Article Save plugin

This plugin holds Cooper's Instapaper reading workflow. It bundles Cooper's
registered Executor Personal app connection for ChatGPT Work and Codex cloud,
and can use the direct Executor Personal MCP on the local Mac. Both routes use
the same `instapaper` connection. Executor calls the hosted Worker, which owns
the Instapaper credentials.

The Worker can check Instapaper without writing. Its save tool requires explicit
approval for each article and verifies every successful save by reading it back.
The plugin does not add a second Instapaper connection or move any credentials
into Codex.
