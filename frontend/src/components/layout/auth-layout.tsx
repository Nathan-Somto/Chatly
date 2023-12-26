import {  Outlet } from "react-router-dom";
import AuthHeader from "../auth/auth-header";


export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background  pb-8">
      <AuthHeader/>
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-600">
        <Outlet/>
    </main>
    </div>
  )
}
