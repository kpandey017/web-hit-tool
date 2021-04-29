const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
var Task = require('../models/task');
var TaskLog = require('../models/tasklog');
var https = require('https');
const request = require('request');

exports.get_all_live_tasks =  async (callback)=> {
    //lastDate:{$gte:  new Date()}
    
    Task.find({}, async (err, tasks) => {
        callback(tasks);
      

    })
};

// exports.navigateUrl =  (tasks)=> {
//     request('https://api.proxyflow.io/v1/proxy/random?token=35847e1be17598f9444b9554&maxTimeSinceCheck=5000&ssl=true&protocol=http', function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           console.log(body)

//             let t1= JSON.parse(body);
//             console.log('http://'+t1.ip+':'+t1.port);
            
//             (async() => {
//             const browser = await puppeteer.launch({

//                 args: [ '--proxy-server=http://'+t1.ip+':'+t1.port,'--no-sandbox' ],
//                 //headless: false

//             });
//             const page = await browser.newPage();
//             page.on('request', async (request) => {
//                     await pr.proxyRequest({
//                     page,
//                     proxyUrl: 'http://'+t1.ip+':'+t1.port,
//                     request,
//                     });
//             });
            
//             var fnNavigate= async (link,setting)=>{
//                 await  page.goto(link).catch( async(error)=> {
//                     if(error.message.indexOf("ERR_PROXY_CONNECTION")>-1){
//                         if( setting.count<4){
//                             await page.waitFor(1500);
//                             setting.count=setting.count+1;
//                             await fnNavigate(link,setting);
//                         }                    
//                         else{
//                             process.exit();
//                         }
//                    }
//                 });
//             };
//             var logNavigation= async (qid)=>{
//                 try {
//                     let today = new Date();
//                     const date=today.getDate();
//                     const monthNames = ["January", "February", "March", "April", "May", "June",
//                         "July", "August", "September", "October", "November", "December"
//                     ];
//                     const month= monthNames[today.getMonth()];
//                     const record = await TaskLog.findOne({date,month,qid});
//                     if(record){
//                         const c=record.count+1;
//                         await TaskLog.update({qid:qid,month:month,date:date},{$set:{count:c}}).exec()
//                     }
//                     else{
//                         const user = new TaskLog({
//                             _id: new mongoose.Types.ObjectId(),
//                             qid:qid,
//                             date:date,
//                             month:month,
//                             count:1
//                         });
                    
//                         await user.save()
//                     }
                        
//                 } catch (error) {
//                     console.log(error);                    
//                 }
//             };
//             for (let index = 0; index < tasks.length; index++) {
//                 const task = tasks[index];
//                 let setting ={
//                     count:0
//                 }
//                 await fnNavigate(task.url,setting);
//                 if(setting.count<=4){
//                     await logNavigation(task.id);
//                     await page.waitFor(25000);                    
//                 }
                    
//             }
//             process.exit();
        
//         })();

//         }
//         else
//             process.exit();
//       });
// };


exports.navigateUrl=  (tasks)=> {

    // var fnNavigate= async (link,setting)=>{
    //     await  page.goto(link).catch( async(error)=> {
    //         if(error.message.indexOf("ERR_PROXY_CONNECTION")>-1){
    //             if( setting.count<4){
    //                 await page.waitFor(1500);
    //                 setting.count=setting.count+1;
    //                 await fnNavigate(link,setting);
    //             }                    
    //             else{
    //                 process.exit();
    //             }
    //     }
    //     });
    // };

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
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 1800 });

        for (let index = 0; index < tasks.length; index++) {
            const task = tasks[index];
            await page.goto(task.url);
            await page.waitForTimeout(randomBetween(3,6)*1000);
            await autoScroll(page);
            await page.waitForTimeout(randomBetween(5,20)*1000);
            const hrefs = await page.$$eval('a', as => as.map(a => a.href));
            if(hrefs != null && hrefs != undefined && hrefs.length>0){
                var links= Math.floor(randomBetween(0,hrefs.length-1));
                await page.goto(hrefs[links]);
                await page.waitForTimeout(randomBetween(3,4)*1000);
                await autoScroll(page);
                await page.waitForTimeout(randomBetween(5,10)*1000);
            }
        }

        
        await browser.close()
    }
)();
    
}
