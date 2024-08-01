import Providers from "./components/wrappers/providers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/wrappers/protected-route";
import {ChatsLayout} from "@/components/layout";
import AuthLayout from "./components/layout/auth-layout";
import { Suspense,lazy } from "react";
import Loader from "./components/ui/loader";
import Home from "@/pages/Home";
const SignIn =  lazy(() => import('./pages/SignIn'));;
const  SignUp =  lazy(() => import('./pages/SignUp'));
const  Chats =  lazy(() => import('./pages/Chats'));
const Chat =  lazy(() => import('./pages/Chat'));
const Discover = lazy(() => import('./pages/Discover'));
const Onboarding =  lazy(() => import('./pages/Onboarding'));
const InviteRedirect =  lazy(() => import('./pages/InviteRedirect'));
const ChatsRedirect = lazy(() => import('./pages/ChatsRedirect'))

function App() {
  return (
      <BrowserRouter>
    <Providers>
        <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding/*" element={<Onboarding/>} />
          <Route path="/chats-redirect/*" element={<ChatsRedirect/>}/>
          <Route element={<AuthLayout/>}>
          <Route path="/sign-in/*" element={<SignIn/>}/>
          <Route path="/sign-up/*" element={<SignUp/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
          <Route path="/discover" element={<Discover/>}/>
          <Route path="/:userId/chats" element={<ChatsLayout/>}>
            <Route  index element={<Chats/>} />
            <Route path=":chatId" element={<Chat/>}/>
          </Route>
          <Route path="/invite-link/:chatId/:inviteCode" element={<InviteRedirect/>}/>
          </Route>
        </Routes>
        </Suspense>
    </Providers>
      </BrowserRouter>
  );
}

export default App;
