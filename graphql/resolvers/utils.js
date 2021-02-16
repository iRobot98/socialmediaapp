const getFields = (info)=>{
    console.log('getFields called')
    console.log(info)
    return info.fieldNodes[0].arguments[0].value.fields
}

const getValue = (field)=>{
    console.log('getValue called')
    return field.value.value
}

const populateObject = (inputObject, info)=>{
    console.log('populateObject called')
    let keys = Object.getOwnPropertyNames(inputObject)
    let fields = getFields(info)
    keys.forEach((key)=>{
        for(let item in fields){
            if(item.name.value === key){
                inputObject[key] = getValue(item)
            }
        }
    })

    return inputObject;
}

module.exports = {
    getFields,
    getValue,
    populateObject
}