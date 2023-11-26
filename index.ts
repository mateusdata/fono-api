import express from "express"

const app = express()

app.use(express.json())
app.get("/", (req, res) => {
    const data = [
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},
        {nome: "maria", idade: 25},{nome: "maria", idade: 25},
    ]
    res.send(data)
})
app.listen(3001, () => console.log("Listening on port 3001"))