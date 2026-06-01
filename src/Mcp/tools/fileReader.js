const fs = require("fs");
const path = require("path");

async function fileReader(params) {

    try {
        const filePath =
            path.join(
                process.cwd(),
                params.path
            );
        const data =
            fs.readFileSync(
                filePath,
                "utf8"
            );
        return {
            file: params.path,
            content: data
        };
    }
    catch (error) {
        return {
            error: "File not found"
        };
    }

}

module.exports =fileReader;