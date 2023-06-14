const app=require("./middlewares")
const authRoutes=require("./Routes/authRoutes")
const productsRoutes=require("./Routes/productsRoutes")
const categoriesRoutes=require("./Routes/categoriesRoutes")
const reviewsRoutes=require("./Routes/reviewsRoutes")


app.use("/v1/api/auth", authRoutes)
app.use("/v1/api/categories", categoriesRoutes)
app.use("/v1/api/products", productsRoutes)
app.use("/v1/api/reviews", reviewsRoutes)


module.exports=app;