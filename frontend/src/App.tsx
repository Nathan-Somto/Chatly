import Providers from "./components/wrappers/providers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProtectedRoute from "./components/wrappers/protected-route";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import {DesktopLayout} from "@/components/layout";
import ChatsDesktop from "@/pages/ChatsDesktop";
import ChatDesktop from "@/pages/ChatDesktop";
import ChatsMobile from "./pages/ChatsMobile";
import Onboarding from "./pages/Onboarding";
import ChatMobile from "./pages/ChatMobile";
import InviteRedirect from "./pages/InviteRedirect";


function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignIn/>}/>
          <Route path="/sign-up/*" element={<SignUp/>}/>
          <Route path="/onboarding" element={<Onboarding/>} />
          <Route element={<ProtectedRoute/>}>
          <Route path="/desktop/:userId/chats" element={<DesktopLayout/>}>
            <Route  index element={<ChatsDesktop/>} />
            <Route path=":chatId" element={<ChatDesktop/>}/>
          </Route>
          <Route path ="/mobile/:userId/chats">
            <Route index element={<ChatsMobile/>}/>
            <Route path=":chatId" element={<ChatMobile/>}/>
          </Route>
          <Route path="/invite-link/:chatId/:inviteCode" element={<InviteRedirect/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
