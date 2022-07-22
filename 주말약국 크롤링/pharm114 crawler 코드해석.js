
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

//전역변수 global
const pageSelector = "body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)" 
//pageSelector 페이지의 갯수 선
let browser = null
let page = null
let pageLength = 0
let finalData = []
let sido = null
let sigungu = null

//실행, unit
//const(상수): 정해진 값
//arg 전달인자
const launch = async function (arg1, arg2) {
    sido = arg1
    sigungu = arg2
    browser = await puppeteer.launch(launchConfig);  //브라우저 실행, async는 promise로 await를 통해 return하게 해줌(세트)
    const pages = await browser.pages() 
    page = pages[0]//새로운 탭
    //await page.newPage(); 
}

//page 이동
const goto = async function (url) { 
    return await page.goto(url)
}

const checkPopup = async function () {
    const pages = await browser.pages()
    await pages.at(-1).close() //at이 length에 제일 마지막을 찾아줌
}

//밑에서 sido 적어줬으니 sido인거 암
const evalCode = async function () {
    await page.evaluate(function (sido) {
        document.querySelector(`#continents > li.${sido} > a`).click() //querySelector 단일 요소만 선택
    }, sido)
}

const evalCity = async function () {
    await page.waitForSelector(`#container #continents > li.${sigungu} > a`) 
    //해당 엘리먼트를 찾을 때까지 기다림, 이동하자마자 페이지가 바로 있는게 아니라 그려지는 시간이 있어야 작동 할 수 있으므로 페이지가 이동이 되고 구동이 되어있을 때 사용. 페이지가 이동 할 때만 사용
    await page.evaluate(function (sigungu) {
        document.querySelector(`#container #continents > li.${sigungu} > a`).click()
    }, sigungu)
}

const alertClose = async function () {
    await page.on('dialog', async function (dialog) { 
        await dialog.accept()
    })
}
//(page.이름)이 아니라 정해져있음, on은 이벤트 함수로, 있을 시에 작동하고 없으면 작동 하지 않는다. 
//창이 아니라 alret이므로 그냥 accept하면 됨

const getPageLength = async function () {
    await page.waitForTimeout(1500)
    await page.waitForSelector(pageSelector)

    pageLength = await page.evaluate(function (pageSelector) {
        const result = document.querySelector(pageSelector).children.length
        return result
    }, pageSelector)
}


const getData = async function () {
    for (let i = 1; i < pageLength; i++) {//페이지 수 만큼 반복
        await page.waitForSelector(pageSelector) //page 이동시에 wait
        const inforArr = await page.evaluate(function (i, sido, sigungu) {
        //const (이름) /inforArr(정보배열)

            //:nth-child(N) : 부모안에 모든 요소 중 n번째(자식) 요소, 선택자로 1부터 시작
            //document에 table이 2개가 잡힘으로 사용할 자식만 빼줌
            //부등호가 있다면 나의 바로 밑에 하나만 찾음 
            //부등호가 없다면 전부 가져가겠다.
            //브라우저에서 돌아가는 코드
            var trArr=  document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr")
            var returnData = []//다수모색

            for (var i = 0; i < trArr.length; i++) {
                var currentTr = trArr[i] //currentTr을 통해 현재 행을 가져 올 수 있다. 

                //.innerText 해당 element내에서 사용자에게 보여지는 텍스트 값을 읽어옴 
                //?.는 undefined이지만 에러를 피하기 위해 ?.innerText (? : optional chaining)
                //rapalceAll("변환하고자 하는 대상", "변환 할 문자 값")
                var name = currentTr.querySelectorAll('td')[1]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var addr = currentTr.querySelectorAll('td')[2]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var tel = currentTr.querySelectorAll('td')[3]?.innerText.replaceAll('\n', '').replaceAll('\t', '')
                var time = currentTr.querySelectorAll('td')[4]?.innerText.replaceAll('\n', '').replaceAll('\t', '')

                var jsonData = { name, addr, tel, time, sido, sigungu } //에러원인 : var 이름 확인

                if (jsonData.addr != undefined) {
                    returnData.push(jsonData)
                   }//end innerFor
            }
            return returnData
        }, i, sido, sigungu) //end evaluate

        //concat은 array안에 있는 내장함수, 두개의 문자열을 하나로 합해줌
        finalData = finalData.concat(inforArr)
        console.log(finalData.length) //let 주기

        //await.evaluate(function(i. ){ }) : evaluate는 console에 이 코드 입력됨
        if (pageLength != i) {
            await page.evaluate(function (i, pageSelector) {
                document.querySelector(pageSelector).children[i].click()
                //children을 i로 입력해주면서 돌게해야한다. 1로 고정하면 1p만 뜸
            }, i, pageSelector)

        await page.waitForSelector('#printZone')
        }
    }//end for

    browser.close()
}//end getData

const writeFile = async function () {
    const stringData = JSON.stringify(finalData) //문자열로 변환
    const exist = fs.existsSync(`./json/${sido}`)
    //const dirextory = fs.existSync("./sample") : 디렉토리 경로입력, 디렉토리 존재여부 체크
    //fs는 file system으로 node.js 환경에서 파일시스템에 접근, 사용 할 수 있게 해주는 npm

    if(!exist) {
        fs.mkdir(`./json/${sido}`, {recursive : true}, function(err){
            console.log(err)
        })
    } //파일이 없으면 해당 파일을 생성 (mkdir), err(에러)가 무슨 함수인지 보기 위해 콘솔을 찍는다 

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
