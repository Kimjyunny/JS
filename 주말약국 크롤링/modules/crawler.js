
import puppeteer from 'puppeteer-core'
import os from 'os'
import fs from 'fs'
import { stringify } from 'querystring'

const macUrl = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const whidowsUrl = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const currentOs = os.type()
const launchConfig = {
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications', '--disable-extensions'],
    executablePath: currentOs == 'Darwin' ? macUrl : whidowsUrl
}


const pageSelector = "body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)"
let browser = null
let page = null
let pageLength = 0
let finalData = []
let sido = null
let sigungu = null


const launch = async function (arg1, arg2) {
    sido = arg1
    sigungu = arg2
    browser = await puppeteer.launch(launchConfig);
    const pages = await browser.pages()
    page = pages[0]
}

const goto = async function (url) {
    return await page.goto(url)
}

const checkPopup = async function () {
    const pages = await browser.pages()
    await pages.at(-1).close()
}

const evalCode = async function () {
    await page.evaluate(function (sido) {
        document.querySelector(`#continents > li.${sido} > a`).click()
    }, sido)
}

const evalCity = async function () {
    await page.waitForSelector(`#container #continents > li.${sigungu} > a`)
    await page.evaluate(function (sigungu) {
        document.querySelector(`#container #continents > li.${sigungu} > a`).click()
    }, sigungu)
}

const alertClose = async function () {
    await page.on('dialog', async function (dialog) {
        await dialog.accept()
    })
}

const getPageLength = async function () {
    await page.waitForTimeout(1500)
    await page.waitForSelector(pageSelector)

    pageLength = await page.evaluate(function (pageSelector) {
        const result = document.querySelector(pageSelector).children.length
        return result
    }, pageSelector)
}

const getData = async function () {
    for (let i = 1; i < pageLength; i++) {
        await page.waitForSelector(pageSelector)
        const inforArr = await page.evaluate(function (i, sido, sigungu) {
            
            var trArr=  document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr")
            var returnData = []

            for (var i = 0; i < trArr.length; i++) {
                var currentTr = trArr[i]

                var name = currentTr.querySelectorAll('td')[1]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var addr = currentTr.querySelectorAll('td')[2]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var tel = currentTr.querySelectorAll('td')[3]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var time = currentTr.querySelectorAll('td')[4]?.innerText.replaceAll('\n', '').replaceAll('\t', '')

                var jsonData = { name, addr, tel, time, sido, sigungu }

                if (jsonData.addr != undefined) {
                    returnData.push(jsonData)
                   }//end innerFor
            }
            return returnData
        }, i, sido, sigungu) //end evaluate

        finalData = finalData.concat(inforArr)
        console.log(finalData.length)

        if (pageLength != i) {
            await page.evaluate(function (i, pageSelector) {
                document.querySelector(pageSelector).children[i].click()
            }, i, pageSelector)

        await page.waitForSelector('#printZone')
        }
    }//end for

    browser.close()
}//end getData

const writeFile = async function () {
    const stringData = JSON.stringify(finalData)
    const exist = fs.existsSync(`./json/${sido}`)

    if(!exist) {
        fs.mkdir(`./json/${sido}`, {recursive : true}, function(err){
            console.log(err)
        })
    }

    const filePath = `./json/${sido}/${sigungu}.json`

    await fs.writeFileSync(filePath, stringData)
}


export {
    launch,
    goto,
    checkPopup,
    evalCode,
    evalCity,
    alertClose,
    getPageLength,
    getData,
    writeFile
}

