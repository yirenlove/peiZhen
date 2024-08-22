const { log } = require("debug/src/node")

log('i am required')

module.exports = function(){
    log('i an a.js')
}