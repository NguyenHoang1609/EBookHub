import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../Home/Home.js';

function RouteIndex(props) {
    return (
        <div>
            <BrowserRouter>
                <Routes >

                    <Route index element={<Home />}></Route>

                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RouteIndex;