import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import dataRouter from "./router/dataRoute.js"
dotenv.config();
const port = process.env.PORT || 5000
// console.log(process.env.CLIENT_URL)

const app = express();
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
    next()
})

app.use(express.json({ limit: '10mb' }))
app.use('/data', dataRouter);

app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }))
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }))

const startServer = async () => {
    try {
        app.listen(port, () => console.log(`Server is listining on port : ${port}`))

    } catch (err) {
        console.log(err);
    }
}
startServer();