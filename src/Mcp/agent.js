const executeTool = require("./toolExecutor");

async function aiAgent(query) {

    query = query.toLowerCase();
    if (query.includes("weather")) {

        const city =
            query
                .replace("weather in", "")
                .replace("weather", "")
                .trim();

        return await executeTool(
            "weather",
            city || "chennai"
        );

    }
    if (
        query.includes("news") ||
        query.includes("headlines") ||
        query.includes("updates")
    ) {

        const topic =
            query
                .replace("news", "")
                .replace("latest", "")
                .trim();

        return await executeTool(
            "news",
            topic || "technology"
        );

    }
    if (
        query.includes("calculate") ||
        query.includes("+") ||
        query.includes("-") ||
        query.includes("*") ||
        query.includes("/")
    ) {

        const expression =
            query.replace("calculate", "").trim();

        return await executeTool(
            "calculator",
            expression
        );

    }
    if (
        query.includes("users") ||
        query.includes("user list") ||
        query.includes("show users")
    ) {

        return await executeTool(
            "database",
            { type: "getUsers" }
        );

    }
    if (
        query.includes("read file") ||
        query.includes("open file")
    ) {

        const file =
            query
                .replace("read file", "")
                .replace("open file", "")
                .trim();

        return await executeTool(

            "fileReader",

            { path: file || "package.json" }

        );

    }
    if (
        query.includes("send email") ||
        query.includes("mail")
    ) {

        return await executeTool(

            "email",

            {

                to: "test@gmail.com",
                subject: "SelfAI Test",
                message: "Email from SelfAI"

            }

        );

    }

    return await executeTool(
        "webSearch",
        query
    );

}

module.exports = aiAgent;