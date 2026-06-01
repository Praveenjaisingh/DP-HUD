const axios = require("axios");

async function webSearch(query) {

    try {

        const response =
            await axios.get("https://api.duckduckgo.com/",
                {
                    params: {
                        q: query,
                        format: "json",
                        no_html: 1
                    }
                }
            );
        let results = [];
        if (response.data.AbstractText) {
            results.push(
                response.data.AbstractText
            );
        }
        if (response.data.Answer) {
            results.push(
                response.data.Answer
            );
        }
        if (response.data.Definition) {
            results.push(
                response.data.Definition
            );
        }
        if (response.data.Results) {
            response.data.Results.forEach(item => {
                if (item.Text) {
                    results.push(item.Text);
                }
            });
        }
        if (response.data.RelatedTopics) {
            response.data.RelatedTopics.forEach(item => {
                if (item.Text) {
                    results.push(item.Text);
                }
                if (item.Topics) {
                    item.Topics.forEach(sub => {
                        if (sub.Text) {
                            results.push(sub.Text);
                        }
                    });
                }
            });
        }
        if (results.length === 0) {
            return {
                query,
                results: [
                    "No direct answer found. Try: 'what is That' or Like what is 'Artificial Intelligence'"
                ]
            };
        }
        return {
            query,
            results:
                results.slice(0, 5)
        };
    }
    catch (error) {
        return {
            error: "Search failed"
        };
    }

}

module.exports = webSearch;