const aiAgent =require("../Mcp/agent");

class vrRepository { 

    async searchData(data) {
        const { query } = data;
        if (!query) {
            throw new Error("Search query required");
        }
        const result =await aiAgent(query);
        return result;

    }

}
module.exports = new vrRepository();