
import React, { useEffect } from 'react'
import Dashboard_layout from '../layout/Dashboard_layout'
import { useAuth } from '@clerk/clerk-react'

function Dashboard() {
    const { getToken } = useAuth();
    useEffect(() => {
        async function fetchToken() {
            const token = await getToken();
            console.log("Token:", token);
            // You can use the token to make authenticated requests to your backend here
        }
        fetchToken();
    }, [getToken]);

    return (
        <Dashboard_layout activeMenu="Dashboard">
            <div>
                Dashboard page
            </div>
        </Dashboard_layout>
    )
}

export default Dashboard