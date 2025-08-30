import express from "express";
import path from 'path';

/**
 * 
 * @param {*} app - express app
 */

const configViewEngine = (app) => {
    app.use(express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'ejs');
    app.set('views', './src/views')
}

export default configViewEngine;