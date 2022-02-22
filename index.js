const express = require('express');
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const app = express();
const redis = require('redis');
const session = require('express-session')
const cors = require('cors')
let redisStore = require('connect-redis')(session);

const {createClient} = require('redis')
let redisClient = createClient({ host: REDIS_URL, port: REDIS_PORT, legacyMode: true })
redisClient.connect().catch(console.error)
//routes
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

//links
const PORT = process.env.PORT || 3000;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/Posts?authSource=admin`

//mongoose
mongoose.connect(MONGO_URL,{})
.then(()=>console.log("Succesful connect to DB"))
.catch((e)=>console.log(e))

//main route
app.get('/api/v1', (req,res) => {
    res.send('<h2>DOCKER course. DevOps engineer</h2>')
})

app.enable("trust proxy")

//midleware
app.use(cors({}))
app.use(session({
    store: new redisStore({client:redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000,
    }

}))


app.use(express.json())
app.use('/posts', postRouter)
app.use('/api/v1/users', userRouter)

app.listen(PORT, () => console.log('listening on port ' + PORT));