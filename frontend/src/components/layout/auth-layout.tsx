import {  Outlet } from "react-router-dom";
import AuthHeader from "../auth/auth-header";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background pb-8">
      <AuthHeader/>
    <main className="min-h-screen flex items-center justify-center bg-background">
        <Outlet/>
    </main>
    </div>
  )
}
