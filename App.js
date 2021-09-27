const express = require("express")
const app = express()
const expressWs = require('express-ws')(app)
const aWss = expressWs.getWss()

app.use(express.json())

app.get("/", (req, res) => {
  const id = Date.now()
  res.redirect(`/${id}`)
})
app.get("/:id", (req, res) => {
  res.sendFile(__dirname + "/ws.html")
})

app.ws("/ws", (ws, req) => {
  console.log("Установленно")
  ws.on("message", (msg) => {
    msg = JSON.parse(msg)
    switch(msg.method){
      case "Подключился": conected(ws, msg)
        break
      case "Отправил" : send(ws, msg)
    }
  })
})
const conected = (ws, msg) => {
  ws.sesionId = msg.sesionId
  aWss.clients.forEach(client => {
    if(client.sesionId === msg.sesionId){
      client.send(JSON.stringify(msg))
    }
  })
}
const send = (ws, msg) => {
  ws.sesionId = msg.sesionId
  aWss.clients.forEach(client => {
    if(client.sesionId === msg.sesionId){
      client.send(JSON.stringify(msg))
    }
  })
}


app.listen(5000, () => {
  console.log("App has been started in 5000 port")
})