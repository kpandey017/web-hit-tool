const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
var Task = require('../models/task');
var TaskLog = require('../models/tasklog');
var https = require('https');
let config = require('../config.json');

const request = require('request');


var msRestAzure = require('ms-rest-azure');
var ResourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
var ComputeManagementClient = require('azure-arm-compute');
var clientId = "bd413287-57bc-44ae-8fd9-938c5e3020b9";
var domain = "dfb2636d-0c0a-4ae5-9bcc-d442ee98ca87";
var secret = "-uJCwEXTCOG-_I.RU05tAD1jwCjKYK9A.E";
var subscriptionId = "98c798e8-052c-4251-a40a-c585aedf2133";



const deviceOptions=["Blackberry PlayBook", "web", "web", "web", "web", "BlackBerry Z30", "Galaxy Note 3", "Galaxy Note 3 landscape", "Galaxy Note II", "Galaxy Note II landscape", "Galaxy S III", "Galaxy S III landscape", "Galaxy S5", "Galaxy S5 landscape", "iPad", "iPad landscape", "iPad Mini", "iPad Mini landscape", "iPad Pro", "iPad Pro landscape", "iPhone 6", "iPhone 6 landscape", "iPhone 6 Plus", "iPhone 6 Plus landscape", "iPhone 7", "iPhone 7 landscape", "iPhone 7 Plus", "iPhone 7 Plus landscape", "iPhone 8", "iPhone 8 landscape", "iPhone 8 Plus", "iPhone 8 Plus landscape", "iPhone SE", "iPhone SE landscape", "iPhone X", "iPhone X landscape", "iPhone XR", "iPhone XR landscape", "iPhone 11", "iPhone 11 landscape", "iPhone 11 Pro", "iPhone 11 Pro landscape", "iPhone 11 Pro Max", "iPhone 11 Pro Max landscape", "JioPhone 2", "JioPhone 2 landscape", "Kindle Fire HDX", "Kindle Fire HDX landscape", "LG Optimus L70", "LG Optimus L70 landscape", "Microsoft Lumia 550", "Microsoft Lumia 950", "Microsoft Lumia 950 landscape", "Nexus 10", "Nexus 10 landscape", "Nexus 5", "Nexus 5X", "Nexus 6", "Nexus 6 landscape", "Nexus 6P", "Nexus 6P landscape", "Nexus 7", "Nexus 7 landscape", "Nokia Lumia 520", "Nokia N9", "Nokia N9 landscape", "Pixel 2", "Pixel 2 XL", "Pixel 2 XL landscape", "web", "web", "web", "web", "web"];
exports.get_all_live_tasks =  async (callback)=> {
    Task.find({ "region": { "$in": config.region } }, async (err, tasks) => {
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

    var adClick= async (page) =>{
        const rect = await page.evaluate(el => {
                let validFrames=[];
                let iframes = document.querySelectorAll('iframe');
                if(iframes && iframes.length>0){
                    iframes.forEach(frame => {
                        if(frame.parentElement.offsetHeight > 0 && frame.clientHeight>0 && !frame.src.includes("recap"))
                        validFrames.push(frame);                        
                    });
                }
                if(validFrames.length>0){
                    var randomBetween1=(min, max) =>{
                        if (min < 0) {
                            return min + Math.random() * (Math.abs(min)+max);
                        }else {
                            return min + Math.random() * max;
                        }
                    };
                    var randomIndex= Math.floor(randomBetween1(0,validFrames.length-1));
                    validFrames[randomIndex].parentElement.scrollIntoView();
                    return validFrames[randomIndex].src;

                }

                return null;
        });

        if(rect){
            var adFrame = await page.frames().find(frame => frame.url() === rect);
            adFrame.click('a');    
        }
    }

    var dellocateVM = ()=>{
        msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, credentials) {
            if (err) return console.log(err);
            resourceClient = new ResourceManagementClient(credentials, subscriptionId);
            computeClient = new ComputeManagementClient(credentials, subscriptionId);
            computeClient.virtualMachines.deallocate(config.resourceGroup,config.name,function (err, result) {
              if (err) return console.log('Error occured in deleting the virtual machine: ' + config.name + '\n');
              console.log('Successfully deleted the virtual machine: ' + config.name);
              console.log('\nDeleting the resource group can take few minutes, so please be patient :).');
             
            });
          });
    }

    var updateTaskStatus =(task)=>{ 
        var dateToCheck=task.lastVisit;
        var actualDate =new Date();
        var isSameDay = (dateToCheck && dateToCheck.getDate() === actualDate.getDate() && dateToCheck.getMonth() === actualDate.getMonth() && dateToCheck.getFullYear() === actualDate.getFullYear());
        var dataSet={}
        if(isSameDay){
            dataSet={ $inc: {'totalVisit': 1,'todayVisit':1 },$set:{'lastVisit':actualDate} };
        }
        else{
            dataSet={ $inc: {'totalVisit': 1 },$set:{'lastVisit':actualDate,'todayVisit':1} };
        }
        Task.findOneAndUpdate({ uid: task.uid }, dataSet, {new: true },(err, response)=> { if (err) {console.log(err)} })
    }

    var  navigate= async(task,page)=>{
        
        try {
            await page.goto(task.url);
            await page.waitForTimeout(randomBetween(3,7)*1000);
            await autoScroll(page);            
            await page.waitForTimeout(randomBetween(5,8)*1000);          
            const hrefs = await page.$$eval('a', as => as.map(a => a.href));

            var randomNo=Math.floor(randomBetween(1,55));

            if(randomNo>33&randomNo<=35){
                await page.waitForTimeout(randomBetween(2,4)*1000);
                await adClick(page);
                await page.waitForTimeout(randomBetween(3,4)*1000);
                await autoScroll(page);
            }            
            else if(hrefs != null && hrefs != undefined && hrefs.length>0){
                var links= Math.floor(randomBetween(0,hrefs.length-1));
                await page.goto(hrefs[links]);
                await page.waitForTimeout(randomBetween(3,4)*1000);
                await autoScroll(page);
                await page.waitForTimeout(randomBetween(5,7)*1000);
            }
            await updateTaskStatus(task);    
        } catch (error) {
            console.log(error);
        }            
        
    }

    (async () => {

        const browser = await puppeteer.launch({ headless: false , args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']})
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(50000);

        var deviceName = deviceOptions[Math.floor(Math.random() * deviceOptions.length)];
        if(deviceName=="web"){
            await page.setViewport({ width: 1280, height: 1800 });
        }else{
            const device = puppeteer.devices[deviceName];
            await page.emulate(device);
        }  

        for (let index = 0; index < tasks.length; index++) {
            
            const task = tasks[index];
            await navigate(task,page);

        }
        console.log("All Done");
        await browser.close();
        
        dellocateVM();
        //https.get('https://fnubuntu16centralindia.azurewebsites.net/api/FnVMRestart?name='+config.name+'&group='+config.resourceGroup+'&code=RxS7ZGPLsomYicEFgTSzxDBYL6ETHFIkCIJG/eMNzI/dDFVyLV1T9A==', res => {console.log("Triggered Func")});
    })();    
}
