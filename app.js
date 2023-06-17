const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({path: "./dotenv.config"})
const app=require("./middlewares")
const authRoutes=require("./Routes/authRoutes")
const productsRoutes=require("./Routes/productsRoutes")
const categoriesRoutes=require("./Routes/categoriesRoutes")
const reviewsRoutes=require("./Routes/reviewsRoutes")
const statsRoutes=require("./Routes/statsRoutes")
const cartRoutes=require("./Routes/cartRoutes")
const favoriteRoutes=require("./Routes/favoriteRoutes")




app.use("/v1/api/auth", authRoutes)
app.use("/v1/api/categories", categoriesRoutes)
app.use("/v1/api/products", productsRoutes)
app.use("/v1/api/reviews", reviewsRoutes)
app.use("/v1/api/cart", cartRoutes)
app.use("/v1/api/favorites", favoriteRoutes)
app.use("/v1/api/stats", statsRoutes)




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