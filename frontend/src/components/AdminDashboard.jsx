import React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';

const AdminDashboard = () => {
    return (
        <div>
            <ResponsiveAppBar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>Admin Dashboard</h1>
            </div>
        </div>
    )
};

export default AdminDashboard;