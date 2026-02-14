import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Menu, Share2, User, Wallet, X } from 'lucide-react';
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';
import { UserCreditsContext } from './UserCreditsContext';


function Navbar({ activeMenu }) {
    const [openSideMenu, setOpenSideMenu] = React.useState(false);
    const { credits, fetchUserCredits } = useContext(UserCreditsContext);
    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);
    return (
        <div className='flex items-center justify-between gap-5 | bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30'>
            {/*Left side- menu button and title*/}
            <div className='flex items-center gap-5'>
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className='block lg:hidden text-black hover:bg-gray-100 p-1 rounded transitions-colors'>
                    {openSideMenu ? (
                        <X className='text-2xl' />
                    ) : (
                        <Menu className='text-2xl' />
                    )}
                </button>
                <div className='flex items-center gap-2'>
                    <Share2 className='text-2xl text-blue-600' />
                    <span className='font-semibold text-lg text-gray-800'>FileShare</span>
                </div>
            </div>
            {/*Right side- credits and user button*/}
            <SignedIn>
                <div className='flex items-center gap-4'>
                    <Link to="/subscription" className='text-sm font-medium text-blue-600 hover:underline cursor-pointer'>
                        <CreditsDisplay credits={credits} />
                    </Link>
                    <div className='relative'>
                        <UserButton />
                    </div>
                </div>
            </SignedIn>

            {/* mobile side menu*/}

            {openSideMenu && (
                <div className='fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 '>
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}

        </div>
    )
}

export default Navbar