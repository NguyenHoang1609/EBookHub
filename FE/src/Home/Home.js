import React from 'react';
import Navigation from './component/Navigation';
import Banner from './component/Banner';
import Section from './component/Section';
import Footer from './component/Footer';
import './Home.css';

function Home() {
    return (
        <div>
            <Navigation />
            <Banner />

            {/* Top Books Section - Most Viewed */}
            {/* <Section
                title="Sách đọc nhiều nhất"
                apiType="getTopBooks"
                apiParams={{ limit: 10 }}
                showRanking={true}
                showMemberBadge={true}
            /> */}

            {/* All Books Section - With Pagination */}
            <Section
                title="Tất cả sách"
                apiType="getAllEbooks"
                apiParams={{
                    page: 1,
                    limit: 10,
                    status: 'published'
                }}
                showRanking={false}
                showMemberBadge={false}
            />

            <Footer />
        </div>
    );
}

export default Home;
