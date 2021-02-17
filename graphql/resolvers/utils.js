
const chooseTarget= (target)=>{
    switch(typeof(target)){
        case 'undefined':
            return `undefined`
        case 'object':
            return printObject(target);
        case 'symbol':
            if(target.iterator != undefined){
                return printArray(target)
            }
        default:
            return `${target}`
    }
}

const printArray = (array )=>{
    let result = ""
    let i = 0
    array.forEach((item)=>{
        result = `${result} \n${i}:${chooseTarget(item)}`;
        i++;
    })
    return result
}

const printObject = (object )=>{
    const keys = Object.getOwnPropertyNames(object)
    
    let result = "" 
    let i = 0
    keys.forEach((item)=>{
        result = `${result} \n${keys[i]}: ${chooseTarget(item)}`
        i++
    })
    return result
}

module.exports = {
    chooseTarget,
    printArray,
    printObject
}