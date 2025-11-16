const express = require('express')
const cors = require('cors')
const routes = require('./routes/todo')
const app = express()
const PORT = 2000
app.use(express.json())
app.use(cors())
app.use('/api/todos', routes)

app.get('/', (req, res) => {
    res.json({
        message: "Todos API is running"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})