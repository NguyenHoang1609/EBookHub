import express from "express";
// import JWTservice from '../middleware/JWTservice';
const router = express.Router();

/**
 * 
 * @param {*} app :express app
 */



const initWebRoutes = (app) => {
    // router.all('*', JWTservice.checkCookieService, JWTservice.authenticateCookieService);

    router.get("/", (req, res) => {
        res.send("Hello World")
    })
    return app.use("/", router)
}

export default initWebRoutes;