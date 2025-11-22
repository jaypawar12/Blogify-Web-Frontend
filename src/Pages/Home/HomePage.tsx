import React from 'react'
import { useNavigate } from 'react-router';

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div>
            <h1 className='text-2xl'>HomePage</h1>
            <button onClick={() => {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
            }}>Logout</button>
        </div>
    )
}
