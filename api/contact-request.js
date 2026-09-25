// Configure CONTACT_REQUEST_WEBHOOK_URL or reuse SERVICE_REQUEST_WEBHOOK_URL.
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({accepted:false})}
  if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({accepted:false});
  try{if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({accepted:false})}catch{return res.status(403).json({accepted:false})}
  let data;try{data=typeof req.body==='string'?JSON.parse(req.body):req.body}catch{return res.status(400).json({accepted:false})}
  if(!data||typeof data!=='object')return res.status(400).json({accepted:false});
  const clean=(key,max)=>typeof data[key]==='string'?data[key].trim().slice(0,max):'';
  const type=clean('type',20),topic=clean('topic',140),message=clean('message',2000),email=clean('email',254),phone=clean('phone',40),page=clean('page',200);
  if(!['chat','consultation'].includes(type)||!topic||!message||(!email&&!phone)||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return res.status(400).json({accepted:false});
  const endpoint=process.env.CONTACT_REQUEST_WEBHOOK_URL||process.env.SERVICE_REQUEST_WEBHOOK_URL;
  if(!endpoint)return res.status(503).json({accepted:false});
  try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.SERVICE_REQUEST_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.SERVICE_REQUEST_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify({type:`website-${type}`,topic,message,email,phone,page}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)return res.status(502).json({accepted:false});
    return res.status(200).json({accepted:true});
  }catch{return res.status(502).json({accepted:false})}
};
