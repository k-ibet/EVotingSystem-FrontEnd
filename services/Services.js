// const Store = require("electron-store")
// const storage = new Store()


function getToken(key){
    
}

function setToken(){

}

function setHashCode(k,l) {
    // k = strip(k)
    var charCodeString = ''
    // km = JSON.parse(k)
    for (i in k){
       ans = k.charCodeAt(i)
       charCodeString+=(ans.toString())
    }
    num = parseInt(charCodeString,10)
    const index = num % l.toString()
    return index

    // storage.set(index, {'txid':'12345', 'voted':"candidate1"})

}

function getHashCode(){

}

module.exports = {setHashCodeServices:setHashCode}
