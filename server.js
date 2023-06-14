const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({path: "./dotenv.config"})
const app=require("./app")

const DB=process.env.DATABASE
const port=process.env.PORT
mongoose.connect(DB, {
    useNewUrlParser: true
}).then(con =>{
    console.log(`Database connected successfully on port ${port}`)
}).catch(err =>{
    console.log(`There is error in connecting the database to port ${port}`, err)
})
app.listen(port, ()=>{
    console.log(`Server running on port ${port}...🏃`)
})