import {launch, goto, alertClose, checkPopup, evalCode, evalCity, getPageLength, getData } from './modules/crawler.js' //./는하면 현재 레벨에 있는 경로를 찾고 그 모듈스에 있는 크롤러를 불러왔음

async function main() {
  //브라우저 실행
 await launch()

//페이지 이동 
 await goto('https://www.pharm114.or.kr/main.asp') //promise니깍 await 올려줘야함 

 await checkPopup()

 await evalCode('seoul')
 
 await evalCity('gangnam_gu')

 await alertClose()

 await getPageLength()

 await getData()

}


main()