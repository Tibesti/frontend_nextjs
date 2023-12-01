"use client";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { user_data } from "@/utils/auth_token";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const isAuthenticated = !!user_data;
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        return redirect("/auth/login");
      }
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    const logOut = () => {
        sessionStorage.clear();
        router.push("/auth/login");
    }

    return <>
        <div className='shadow-md py-4 px-6 md:px-[150px] flex justify-end items-center gap-x-4'>
            <h3 className='font-bold text-lg'>Welcome, {user_data?.user?.company_name || ""}</h3>
            <div className="h-10 w-10 rounded-full overflow-hidden">
                {
                    !!user_data?.user?.image ? 
                    <img src={user_data?.user?.image} alt="" className="w-full h-auto"/>
                    :
                    <UserCircleIcon className="text-slate-700 w-full h-auto"/>
                }
            </div>
            <ArrowRightOnRectangleIcon className="text-red-500 w-7 cursor-pointer" onClick={logOut} />
        </div>
        <Component {...props} />
    </>;
  };
}