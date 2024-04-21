const fs = require("node:fs/promises")
const path = require("node:path")

const read = async () => {
    const users = await fs.readFile(path.join(process.cwd(), "db.json"), 'utf-8');
    return JSON.parse(users);
}

const write = async (users) => {
    await fs.writeFile(path.join(process.cwd(), "db.json"), JSON.stringify(users))
}

module.exports = {read, write}