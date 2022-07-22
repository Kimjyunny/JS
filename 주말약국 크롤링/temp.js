var trArr = document.querySelector("#printZone")

var returnData = []

for (var i = 0; i < trArr.length; i++) {
    var currentTr = trArr[i]

    var name = currentTr.querySelectorAll('td')?.innerText 
    var addr = currentTr.querySelectorAll('td')[2]?.innerText
    var tel = currentTr.querySelectorAll('td')[3]?.innerText
    var time = currentTr.querySelectorAll('td')[4].innerText
}

var jsonData = { name, addr,tel, time }

if (jsonData.address != undefined ) {
    returnData.push(jsonData)
}
