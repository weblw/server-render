const express=require('express')
const fs=require('fs')
// express 实例
const app=express()

// 创建渲染器
const {createBundleRenderer}=require('vue-server-renderer')
const bundle=require('../dist/server/vue-ssr-server-bundle.json')
const clientManifest=require('../dist/client/vue-ssr-client-manifest.json')
const renderer=createBundleRenderer(bundle,{
  runInNewContext:false,
  template:fs.readFileSync('../src/index.temp.html','utf-8'),
  clientManifest:clientManifest
})

function renderToString(context){
  return new Promise((resolve,reject)=>{
    renderer.renderToString(context,(err,html)=>{
      if(err){
        reject(err)
        return
      }
      resolve(html)
    })
  })
}

app.use(express.static('../dist/client'))
// 服务端路由声明
app.get('*',async (req,res)=>{
  try{
    const context={
      title:'ssr test',
      url:req.url
    }
    const html=await renderToString(context)
    res.send(html)
  }catch(error){
    res.status(500).send('server error')
  }
})

app.listen(3000,()=>{
  console.log('渲染服务器已启动！！！')
})