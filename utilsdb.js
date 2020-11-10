

const db=require('./models')
const findone=async (table,key,value)=>{let jfilter={};jfilter[key]=value;  return await db[table].findOne({raw:true,where:{... jfilter}}) }
const findandvalidate=async (table,key,value)=>{const resp=await findone(table,key,value);  if (resp){return 1} else {return 0}}
const findandinvalidate=async (table,key,value)=>{  const resp=await findone(table,key,value);  if (resp){return 0} else {return 1}}

const findonej=async(table,jdata)=>{return await db[table].findOne({raw:true,where:jdata}) }
const findjandvalidate=async (table,jdata)=>{const resp=await findonej(table,jdata);  if (resp){return 1} else {return 0}}
const findjandinvalidate=async (table,jdata)=>{  const resp=await findonej(table,jdata);  if (resp){return 0} else {return 1}}

const createrow=async(table,jdata)=>{await db[table].create(jdata)}
const findall=async(table)=>{return await db[table].findAll({raw:true})}
const update=async(table,jfilter,jupdates)=>{return await db[table].update({jfilter,jupdates})}
const __findmostrecentn=async(table,n)=>{return await db[table].findAll({limit: n,order: [ [ 'createdat', 'DESC']] })}
const findmostrecentn=async(table,n)=> await db[table].findAll({limit: n,order: [ [ 'createdat', 'DESC']] })
module.exports={
  findone , findandinvalidate   , findandvalidate
  , findonej , findjandinvalidate  , findjandvalidate
  , createrow
  , findall
  , update
  , findmostrecentn
}
