const app=require("./middlewares")
const authRoutes=require("./Routes/authRoutes")
const productsRoutes=require("./Routes/productsRoutes")
const categoriesRoutes=require("./Routes/categoriesRoutes")
const reviewsRoutes=require("./Routes/reviewsRoutes")
const statsRoutes=require("./Routes/statsRoutes")


app.use("/v1/api/auth", authRoutes)
app.use("/v1/api/categories", categoriesRoutes)
app.use("/v1/api/products", productsRoutes)
app.use("/v1/api/reviews", reviewsRoutes)
app.use("/v1/api/stats", statsRoutes)


module.exports=app;