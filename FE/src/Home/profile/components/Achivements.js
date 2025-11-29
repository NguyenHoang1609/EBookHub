import React from 'react';
import './Achivements.scss';

function Achivements() {
    return (
        <div className="achievements-container">
            <div className="section-header">
                <h2>Achievements</h2>
                <p>View your achievements and badges</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">🏆</div>
                <h3>Achievements</h3>
                <p>This feature is under development and coming soon!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Reading badges</div>
                    <div className="feature-item">✓ Reading time stats</div>
                    <div className="feature-item">✓ Reader leaderboard</div>
                    <div className="feature-item">✓ Reading goals</div>
                </div>
            </div>
        </div>
    );
}

export default Achivements;
