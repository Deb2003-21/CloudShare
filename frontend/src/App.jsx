import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Transactions from './pages/Transactions';
import Subscription from './pages/Subscription';
import MyFiles from './pages/MyFiles';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import UserCreditsProvider from './components/UserCreditsContext';
import PublicFileView from './pages/PublicFileView';

const App = () => {
  return (

    <UserCreditsProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={
            <>
              <SignedIn> <Dashboard /></SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>


          } />
          <Route path="/upload" element={<>
            <SignedIn> <Upload /></SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>} />
          <Route path="/transactions" element={<>

            <SignedIn> <Transactions /></SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>} />
          <Route path="/myfiles" element={
            <>
              <SignedIn> <MyFiles /></SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          <Route path="/file/:fileId" element={<PublicFileView />} />
          <Route path="/subscription" element={<>
            <SignedIn> <Subscription /></SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>} />
        </Routes>
        <Routes path="/*" element={<RedirectToSignIn />} />
      </BrowserRouter>
    </UserCreditsProvider>

  )
};
export default App;