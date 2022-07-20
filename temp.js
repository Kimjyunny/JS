
    // setTimeout(function(){
    //     console.log('a')
    // }, 3000) //3초 뒤에 a 함수가 실행이 된다 


    // setTimeout(function(){
    //     console.log('b')
    // }, 1000) ///1초뒤에 b함수가 실행이 된다 


    //콜백함수

// function cofeeMachine (type, callback) {
//     setTimeout(function(){
//         console.log(type, ':done')
//         callback()
//     }, 2000) //커피머신이 실행되는때 시간은 2초뒤
// }

// cofeeMachine('A', function(){
//     cofeeMachine('B', function(){ 
//         cofeeMachine('C', function(){
//             cofeeMachine('D', function(){

//             })
//         })
//     }) //콜백이 늘어날수록 가독성이 안좋아짐 

// }) //A라는 타입의 원두를 넣고

//대안방안 : Promise
function asyncTask (args) {
    const promise = new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log(args)
            resolve()
        }, 1000)
    })
    return promise
}
// asyncTask('task 1')
// .then(function(){
//     return asyncTask('task 2')
// })
// .then(function(){
//     return asyncTask('task 3')
// }) //그래도 코드가 길다

//대안방안 : async await
await asyncTask('task A')
await asyncTask('task B')
await asyncTask('task C')
await asyncTask('task 1')




