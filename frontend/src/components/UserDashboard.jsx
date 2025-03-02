import React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';

const UserDashboard = () => {
    return (
        <div>
            <ResponsiveAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>User Dashboard</h1>
            </div>
        </div>
    )
};

export default UserDashboard;