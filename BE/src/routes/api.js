import express from "express";
import JWTservice from '../middleware/JWTservice'
import authController from '../controllers/authController'
import pageController from '../controllers/pageController'
import userController from '../controllers/userController'
import ebookController from '../controllers/ebookController'
import { uploadAvatar, handleUploadError } from '../middleware/upload'

const router = express.Router();

/**
 * 
 * @param {*} app :express app
 */

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/account', authController.checkAccount);
// User management routes
router.get('/users', userController.getAllUsers);
router.get('/users/stats', userController.getUserStats);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', uploadAvatar, handleUploadError, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.delete('/users/bulk', userController.bulkDeleteUsers);
router.put('/users/:id/password', userController.changePassword);

// Ebook routes
router.post('/ebooks', ebookController.createEbook);
router.post('/ebooks/upload', ebookController.uploadMultiple.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), ebookController.uploadEbook);
router.get('/ebooks', ebookController.getAllEbooks);
router.get('/ebooks/top', ebookController.getTopBooks);
router.get('/ebooks/stats', ebookController.getEbookStats);
router.get('/ebooks/:ebookId', ebookController.getEbookById);
router.put('/ebooks/:ebookId', ebookController.updateEbook);
router.delete('/ebooks/:ebookId', ebookController.deleteEbook);

// Page routes
router.post('/pages', pageController.createPage);
router.get('/pages/ebook/:ebookId', pageController.getPagesByEbook);
router.get('/pages/:pageId', pageController.getPageById);
router.get('/pages/ebook/:ebookId/page/:pageNumber', pageController.getPageByNumber);
router.put('/pages/:pageId', pageController.updatePage);
router.delete('/pages/:pageId', pageController.deletePage);



const initApiRoutes = (app) => {

    // app.use(JWTservice.checkCookieService, JWTservice.authenticateCookieService);


    return app.use("/api", router)

}

export default initApiRoutes;