# Instapaper Article Save plugin

This plugin holds Cooper's Instapaper reading workflow. It uses the installed
Executor Personal MCP and its `instapaper` connection. Executor calls the
hosted Worker, which owns the Instapaper credentials.

The Worker can check Instapaper without writing. Its save tool requires explicit
approval for each article and verifies every successful save by reading it back.
The plugin does not add a second, direct MCP connection.
