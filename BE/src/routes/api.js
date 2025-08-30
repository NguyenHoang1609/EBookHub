import express from "express";
import JWTservice from '../middleware/JWTservice'
import authController from '../controllers/authController'

const router = express.Router();

/**
 * 
 * @param {*} app :express app
 */

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/profile', authController.getProfile);

const initApiRoutes = (app) => {

    app.use(JWTservice.checkCookieService, JWTservice.authenticateCookieService);

    return app.use("/api", router)

}

export default initApiRoutes;