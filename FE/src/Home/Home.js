import React from 'react';
import Navigation from './component/Navigation';
import Banner from './component/Banner';
import Section from './component/Section';
import './Home.css';
function Home() {
    return (
        <div>
            <Navigation />
            <Banner />

            <Section />
        </div>
    );
}

export default Home;
