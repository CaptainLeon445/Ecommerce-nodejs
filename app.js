const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config({path: "./dotenv.config"})
const app=require("./middlewares")
const AppError = require("./utils/appError")
const globalErrorHandler = require("./utils/globalErrorHandler")
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
app.all("*", (req, res, next)=>{
    const message=`Can't find the requested ${req.originalUrl} on server`
    next(new AppError(message, 404))
  })
  
app.use(globalErrorHandler)


let DB = process.env.DATABASE_DEV;
let port = 8000;
if (process.env.NODE_ENV === "production") {
  DB = process.env.DATABASE_DEV
  // DB = process.env.DATABASE_PROD.replace(
  //   "<PASSWORD>",
  //   process.env.DATABASE_PASSWORD
  // );
  // port = process.env.PORT;
}
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log(`Database connected successfully on port ${port}`);
  })
  .catch((err) => {
    console.log(
      `There is error in connecting the database to port ${port}`,
      err
    );
  });

const server=app.listen(port, () => {
  console.log(`Server running on port ${port}...🏃`);
});

process.on("unhandledRejection", (err)=>{
  console.log(err.name,":",err.message)
  console.log("UNHANDLED REJECTION 💥 Shutting down...")
  server.close(()=>{
    process.exit(1)
  })
})

process.on("uncaughtException", (err)=>{
  console.log(err.name,":",err.message)
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down...")
  server.close(()=>{
    process.exit(1)
  })
})
