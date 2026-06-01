// src/tools/toolExecutor.js

// Import all tools
const tools = require("./toolRegistry");  // make sure toolRegistry.js exists

/**
 * Executes a tool by name with given input
 * @param {string} toolName
 * @param {any} input
 */
async function executeTool(toolName, input) {
    const tool = tools[toolName];

    if (!tool) {
        return { error: "Tool not found", toolName };
    }

    // Call the tool, it might be async
    try {
        if (typeof tool === "function") {
            return await tool(input);
        }
        return { error: "Invalid tool", toolName };
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = executeTool;