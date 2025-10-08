import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../Home/Home.js';
import Dashboard from '../System/Dashboard.js';
import EbookDetail from '../Home/ebook/EbookDetail.js';
import Reader from '../Home/ebook/Reader.js';
import UserProfile from '../Home/profile/UserProfile.js';
import MoreEbook from '../Home/component/MoreEbook.js';
function RouteIndex(props) {
    return (
        <div>
            <BrowserRouter>
                <Routes >
                    <Route index element={<Home />}></Route>
                    <Route path="/system" element={<Dashboard />}></Route>
                    <Route path="/book/:id" element={<EbookDetail />}></Route>
                    <Route path="/reader/:id" element={<Reader />}></Route>
                    <Route path="/payment" element={<Payment />}></Route>
                    <Route path="/profile" element={<UserProfile />}></Route>
                    <Route path="/more-ebook" element={<MoreEbook />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default RouteIndex;