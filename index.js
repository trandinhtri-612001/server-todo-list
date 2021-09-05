require("dotenv").config();
const express = require('express');
const app = express();
const ConnectDB = require('./connectdb/ConnectDB');

const cors = require ('cors')
 



// parse application/json
app.use(express.json())



// app.use(cors);
const UsersRouter = require('./routers/auth')
const PostsRouter = require('./routers/posts')
ConnectDB();



app.get('/abc', (req, res) => {
    res.status("server not runing")
})


app.use(cors())
app.use('/api/auth',UsersRouter)
app.use('/api/post', PostsRouter)

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))