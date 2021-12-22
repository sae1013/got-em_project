
// current: 기준 객체, target: 합치려는 객체, 
const mergeObject = (currentObj,targetObj)=>{
  Object.keys(targetObj).forEach((objKey)=>{ // [fit,feeling,color]
    Object.keys(targetObj[objKey]).forEach((key)=>{
      currentObj[objKey][key]+=targetObj[objKey][key]
    })
  });
  return currentObj;
}

module.exports = mergeObject