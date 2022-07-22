import { launch, goto, checkPopup, evalCode, evalCity, alertClose, getPageLength, getData,writeFile } from './modules/crawler.js'

async function main() {

await launch( 'seoul', 'mapo_gu')

await goto('https://www.pharm114.or.kr/main.asp') 

await checkPopup()

await evalCode()

await evalCity()

await alertClose()

await getPageLength()

await getData()

await writeFile()

process.exit(1)

}

main()