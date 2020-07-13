require('events').EventEmitter.defaultMaxListeners = 10000;
const express = require("express");
const puppeteer = require('puppeteer');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express()
let scrap = null;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


async function search_logo(keywords, callback) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.brandroot.com/names?keyword='+keywords, {waitUntil: "networkidle2"})
        const searching = async() => {
            scrap = await page.evaluate(() => document.querySelector('div.brands-list').innerHTML)
            if(scrap)
                callback(scrap)
                // res.send('<!doctype html><html><body>'+scrap+'</body></html>')
            else 
                return searching(0)
          }
        await searching()        
    }
    catch(err) {
        callback(err)
    }
}





app.get('/logo/:id', (req, res) => {
    search_logo(req.params.id, (payload) => {
        res.send(payload)
    })
})

module.exports = {
   path: '/api',
   handler: app
}
