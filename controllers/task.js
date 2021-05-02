const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
var Task = require('../models/task');
var TaskLog = require('../models/tasklog');
var https = require('https');
const request = require('request');

exports.get_all_live_tasks =  async (callback)=> {
    Task.find({}, async (err, tasks) => {
        callback(tasks);
    })
};

exports.navigateUrl=  (tasks)=> {

    var randomBetween=(min, max) =>{
        if (min < 0) {
            return min + Math.random() * (Math.abs(min)+max);
        }else {
            return min + Math.random() * max;
        }
    };

    var autoScroll=async (page)=>{
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 150);
            });
        });
    }
    (async () => {
        const browser = await puppeteer.launch({ headless: false ,
     args: ['--no-sandbox']})
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1800 });
        tasks.push({});
        tasks.push({});
        tasks.push({});
        for (let index = 0; index < tasks.length; index++) {
            try {
                const task = tasks[index];
                await page.goto(task.url);
                await page.waitForTimeout(randomBetween(3,6)*1000);
                await autoScroll(page);
                await page.waitForTimeout(randomBetween(5,10)*1000);
                const hrefs = await page.$$eval('a', as => as.map(a => a.href));
                if(hrefs != null && hrefs != undefined && hrefs.length>0){
                    var links= Math.floor(randomBetween(0,hrefs.length-1));
                    await page.goto(hrefs[links]);
                    await page.waitForTimeout(randomBetween(3,4)*1000);
                    await autoScroll(page);
                    await page.waitForTimeout(randomBetween(5,7)*1000);
                }    
            } catch (error) {
                console.log(error);
            }            
        }
        console.log("Complted");
        https.get('https://fnubuntu16centralindia.azurewebsites.net/api/Function1?name=ubuntu-16-central-india&group=ubuntu-16-central-india&code=1Q8ONwmdNSCb6bKevw/XKwo1s7Ca10WYtpiotWQy15HZeu9XBM7gBg==', res => {console.log("Triggered Func")});
        
        await browser.close();
    }
)();
    
}
