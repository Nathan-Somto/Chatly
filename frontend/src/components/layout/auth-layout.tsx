import {  Outlet, useNavigate } from "react-router-dom";
import AuthHeader from "../auth/auth-header";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect } from "react";


export default function AuthLayout() {
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const navigate = useNavigate();
  useEffect(() => {
    if(isMobile){
      navigate('/')
    }
  }, [isMobile])
  return (
    <div className="min-h-screen w-full bg-background  pb-8">
      <AuthHeader/>
    <main className="min-h-screen flex items-center justify-center bg-background">
        <Outlet/>
    </main>
    </div>
  )
}
