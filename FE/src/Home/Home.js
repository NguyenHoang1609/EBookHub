import React, { useState, useEffect } from 'react';
import Navigation from './component/Navigation';
import Banner from './component/Banner';
import Section from './component/Section';
import Footer from './component/Footer';
import { authAPI } from '../Util/Api';
import './Home.css';

function Home() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLogin();
    }, []);

    const checkUserLogin = async () => {
        try {
            // Try to get user from localStorage or check authentication
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setCurrentUser(user);
            }
        } catch (error) {
            console.log('No user logged in');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Navigation />
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navigation />
            <Banner />

            {/* Favourite Books Section - Only show if user is logged in */}
            {currentUser && (
                <Section
                    title="Sách yêu thích của bạn"
                    apiType="getFavouriteBooks"
                    apiParams={{
                        limit: 10
                    }}
                    userId={currentUser.id}
                    showRanking={false}
                    showMemberBadge={false}
                />
            )}

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
