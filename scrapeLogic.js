const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
  return puppeteer.executablePath()
};

module.exports = { scrapeLogic };
