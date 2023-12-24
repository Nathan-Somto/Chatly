import Providers from "./components/wrappers/providers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProtectedRoute from "./components/wrappers/protected-route";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import {ChatsLayout} from "@/components/layout";
import Chats from "@/pages/Chats";
import Chat from "@/pages/Chat";
import Onboarding from "./pages/Onboarding";
import InviteRedirect from "./pages/InviteRedirect";
import AuthLayout from "./components/layout/auth-layout";


function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding/>} />
          <Route element={<AuthLayout/>}>
          <Route path="/sign-in/*" element={<SignIn/>}/>
          <Route path="/sign-up/*" element={<SignUp/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
          <Route path="/:userId/chats" element={<ChatsLayout/>}>
            <Route  index element={<Chats/>} />
            <Route path=":chatId" element={<Chat/>}/>
          </Route>
          <Route path="/invite-link/:chatId/:inviteCode" element={<InviteRedirect/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
