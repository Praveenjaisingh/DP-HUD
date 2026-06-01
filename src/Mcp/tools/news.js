const axios = require("axios");

async function getNews(topic) {
    try {
        const apiKey = process.env.NEWSAPI_KEY;
        if (!apiKey) throw new Error("Missing NEWSAPI_KEY");

        const response = await axios.get(
            `https://newsapi.org/v2/everything`,
            {
                params: {
                    q: topic.trim(),
                    apiKey: apiKey,
                    language: "en",
                    pageSize: 5
                }
            }
        );

        if (!response.data.articles || response.data.articles.length === 0) {
            return { topic, news: ["No news found"] };
        }

        return {
            topic,
            news: response.data.articles.map(a => a.title)
        };
    } catch (err) {
        console.error(err.response?.data || err.message);
        return { error: "News service unavailable" };
    }
}

module.exports = getNews;