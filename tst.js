
array=[{k:1,v:2}, {k:4,v:5}]
const conva2j=(array,keyin)=>{
json = { ...array };
json = Object.assign({}, array);
json = array.reduce((json, value, key) => { json[keyin] = value; return json; }, {})
return json
}
