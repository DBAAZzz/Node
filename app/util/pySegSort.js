const PinYin = require('./PinYIn')

function arraySearch(zh) {
    for (let name in PinYin) {
        if (PinYin[name].indexOf(zh) != -1) {
            return name
        }
    }
    return ''
}

function ConvertPinyin(obj) {
    const reg = new RegExp(/[\u4e00-\u9fa5]/) //匹配汉字
    let ary = obj.userName.split('')
    let pinyin = ary.reduce((pre, item) => {
        if (reg.test(item)) {
            let name = arraySearch(item)
            pre += name
        } else {
            pre += item
        }
        return pre
    }, '')
    let letter = pinyin.slice(0, 1)
    return { pinyin, letter }
}

const pySegSort = (arr, keyword) => {
    if (!String.prototype.localeCompare) return null
    let obj = {}
    arr.forEach(item => {
        if (keyword) {
            const { pinyin, letter } = ConvertPinyin(item[keyword])
            obj[letter]
                ? obj[letter].push(item)
                : (obj[letter] = [item])
        } else {
            const { pinyin, letter } = ConvertPinyin(item)
            obj[letter]
            ? obj[letter].push(item)
            : (obj[letter] = [item])
        }
    })
    let data=Object.keys(obj).sort((a,b)=>a.localeCompare(b)).map(item=>{
        let data =obj[item]
        data.sort((a,b)=>a.pinyin.localeCompare(b.pinyin))
        return {title:item.toUpperCase(),data}
    })
    return data
}

module.exports = pySegSort;