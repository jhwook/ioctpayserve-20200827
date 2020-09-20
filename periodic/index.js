
const {}=require('./getcoinmarket')
const {}=require('./getgaiagexlive')
const {}=require('./ETH/getestimates')
// const {}=require('./getkrwusd')
if(process.env.NODE_ENV=='development'){}
else {
  const {}=require('./ETH/pollseth')
  const {}=require('./ETH/pollstoken')
  const {}=require('./BTC/polls')
}

