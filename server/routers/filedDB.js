const fs = require("fs").promises;
const fileName = __dirname + "/DB.json";
const readFile = async () => {
  return JSON.parse(await fs.readFile(fileName));
};
const writeFile = async (content) => {
  await fs.writeFile(fileName, JSON.stringify(content));
};

module.exports = {
  async add(message) {
    const obj = await readFile();
    obj.push({ ...message });
    await writeFile(obj);
  },
  async get() {
    return await readFile();
  },
};
