'use client';
import isAuth from "@/components/isAuth";
import { IUser } from "@/interfaces/user.interface";
import { auth_token } from "@/utils/auth_token";
import { UserIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UserDetails() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [userData, setUserData] = useState<IUser|null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(()=>{
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${searchParams.get('id')}`, {
            headers: {
                "Authorization": `Bearer ${auth_token}`
            }
        })
        .then(response => response.data)
        .then(function (response) {
          if(response.success){
            setUserData(response.data)
          }
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
          if(error.response){
            toast.error(error.response.data.message)
          }
        });
    }, [])

    const handleUploadClick = () => {
      const element = document.getElementById('input_file') as HTMLInputElement | null;
      if (element != null) {
        element.click();
      }
    }

    const handleUpload = (e: any) => {
      setUploading(true)
      const formData = new FormData ();
      const inputElement = e.target;
      formData.append("file", inputElement?.files[0]);
      formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`);
  
      axios.post(
       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
       formData
      )
        .then((response) => {
          setUploading(false)
          console.log(response);
          console.log(response.data.secure_url);
          updateUser(response.data.secure_url)
        })
        .catch((error) => {
          setUploading(false)
          console.log(error);
        });
    };

    const updateUser = (image: string) => {
      axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${searchParams.get('id')}`, {image}, {
        headers: {
            "Authorization": `Bearer ${auth_token}`
        }
      })
      .then(response => response.data)
      .then(function (response) {
        if(response.success){
          setUserData(response.data)
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        if(error.response){
          toast.error(error.response.data.message)
        }
      });
    }

    return (
        <main className='py-[50px] px-6 md:px-[150px]'>
          <div className="flex gap-x-1.5 items-center mb-10 cursor-pointer" onClick={()=>router.push('/admin')}>
            <ArrowLeftIcon className="w-4"/>
            <p>Go Back</p>
          </div>
          <h3 className="text-2xl font-semibold mb-6">User details</h3>
          <div className="flex flex-col gap-6">
              <div className="flex gap-x-5 items-center">
                  <div className={`w-[100px] relative h-[100px] bg-blue-300 rounded-full overflow-hidden flex items-center justify-center ${uploading&&'opacity-70'}`}>
                    {
                      uploading ? 
                      <img src="/white-loader.gif" alt="loader" className="w-10"/>
                      :
                        !!userData?.image ? 
                        <img src={userData?.image} alt="user image" className="w-full h-auto" />
                        :
                        <UserIcon className="text-slate-700 w-full h-auto"/>

                    }
                  </div>
                  <input type="file" accept="image/png, image/gif, image/jpeg" id='input_file' onChange={(e)=>{handleUpload(e)}} hidden />
                  <p className="text-green-500 font-semibold cursor-pointer" onClick={handleUploadClick}>Upload picture</p>
              </div>
              <p>Company Name: <span className="text-slate-500">{userData?.company_name || ""}</span></p>
              <p>Number of users: <span className="text-slate-500">{userData?.users || ""}</span></p>
              <p>Number of products: <span className="text-slate-500">{userData?.products || ""}</span></p>
              <p>Percentage (%): <span className="text-slate-500">{userData?.percentage || ""}</span></p>
          </div>
        </main>
    )
}

export default isAuth(UserDetails)