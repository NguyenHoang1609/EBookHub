import React, { useState, useEffect } from 'react';
import Navigation from './component/Navigation';
import Banner from './component/Banner';
import Section from './component/Section';
import Footer from './component/Footer';
import { authAPI, typeAPI } from '../Util/Api';
import './Home.css';

function Home() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);

    useEffect(() => {
        checkUserLogin();
    }, []);

    useEffect(() => {
        fetchTypes();
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

    const fetchTypes = async () => {
        try {
            const result = await typeAPI.getAllTypes();
            if (result?.success && result?.data?.DT?.types) {
                setTypes(result.data.DT.types);
            } else {
                setTypes([]);
            }
        } catch (error) {
            setTypes([]);
        } finally {
            setLoadingTypes(false);
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

            {/* Top Rated Books Section */}


            <Section
                title="Sách mới nhất"
                apiType="getAllEbooks"
                showMemberBadge={true}
                apiParams={{
                    page: 1,
                    limit: 10,
                    status: 'published'
                }}
                showRanking={false}
            />

            <Section
                title="Sách được đánh giá cao nhất"
                apiType="getTopRatedEbooks"
                showMemberBadge={true}
                apiParams={{
                    limit: 10
                }}
                showRanking={false}
            />



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
                    showMemberBadge={true}
                />
            )}

            {/* Type-based Sections (show first 4 types if available) */}
            {!loadingTypes && types.slice(0, 4).map((type) => (
                <Section
                    key={type.typeId}
                    title={type.name}
                    apiType="getAllEbooks"
                    apiParams={{
                        page: 1,
                        limit: 10,
                        status: 'published',
                        typeId: type.typeId
                    }}
                    showRanking={false}
                    showMemberBadge={true}
                />
            ))}



            {/* Top Books Section - Most Viewed */}
            {/* <Section
                title="Sách đọc nhiều nhất"
                apiType="getTopBooks"
                apiParams={{ limit: 10 }}
                showRanking={true}
                showMemberBadge={true}
            /> */}

            {/* All Books Section - With Pagination */}


            <Footer />
        </div>
    );
}

export default Home;
