// mcp server
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addTask, getTasks, updateStatus } from "./todo/todo.js";

// Create an MCP server
const server = new McpServer({
    name: "Todo MCP Server",
    version: "1.0.0"
});

// Add an addition tool
server.tool("add-task",
    { task: z.string() },
    async ({ task }) => {
        const response = addTask(task);

        return {
            content: [{ type: "text", text: response }]
        }
    }
);

server.tool('delete-task',
    { id: z.string() },
    async ({ id }) => {
        const response = removeTask(id);

        return {
            content: [{ type: "text", text: response }]
        }
    }
)

server.tool('update-status',
    { id: z.string(), status: z.number() },
    async ({ id, status }) => {
        const response = updateStatus(id, status);

        return {
            content: [{ type: "text", text: response }]
        }
    }
)

server.tool('get-tasks', async () => {
    const response = getTasks();

    return {
        content: [{ type: "text", text: JSON.stringify(JSON.parse(response)) }]
    }
})

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);