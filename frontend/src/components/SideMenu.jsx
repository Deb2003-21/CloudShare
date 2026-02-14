import { useUser } from '@clerk/clerk-react'
import { User } from 'lucide-react'
import React from 'react'
import { SIDE_MENU_DATA } from '../data2';
import { useNavigate } from 'react-router-dom';

function SideMenu({ activeMenu }) {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <div class="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">

            <div className="flex flex-col items-center justify-center gap-3 mt- m-3 mb-7">
                {user?.imageUrl ? (
                    <img src={user?.imageUrl || ""} alt="Profile image" className="w-20 h-20 bg-slate-400 rounded-full" />

                ) : (
                    //  a fallback UI
                    <User className="w-20 h-20 p-3 bg-slate-400 rounded-full text-white" />
                )}
                <h5 class="text-gray-950 font-medium leading-6">
                    {user?.fullName || ""}
                </h5>
            </div>
            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-200 cursor-pointer ${activeMenu === item.label ? 'bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => navigate(item.path)}
                >
                    <item.icon className={`${activeMenu === item.label ? 'text-white' : 'text-gray-600'}`} />
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export default SideMenu