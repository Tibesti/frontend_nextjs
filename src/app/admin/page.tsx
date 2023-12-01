'use client';
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/20/solid";
import isAuth from "@/components/isAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { IUser } from "@/interfaces/user.interface";
import { auth_token } from "@/utils/auth_token";
import { useRouter } from "next/navigation";

function AdminHome() {
  const [pageView, setPageView] = useState("cards")
  const [usersList, setUsersList] = useState([])
  const router = useRouter()

  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/getAll`, {
        headers: {
            "Authorization": `Bearer ${auth_token}`
        }
    })
    .then(response => response.data)
    .then(function (response) {
      if(response.success){
        setUsersList(response.data)
      }
    })
    .catch(function (error) {
      if(error.response){
        toast.error(error.response.data.message)
      }
    });
  }, [])

  return (
    <main className='py-[50px] px-6 md:px-[150px]'>
        <div className="flex justify-between mb-10">
            <h3 className="text-2xl font-semibold mb-6">User details</h3>
            <div className="w-[120px]">
                <Button 
                    type="button"
                    isLoading={false}
                    isValid={true}
                    text={pageView==="cards"?"COMPARE":"Preview Users"}
                    className="bg-white border !border-green-500 !text-slate-600 text-xs"
                    onClick={()=>{
                        pageView==="cards" ? setPageView("table"):setPageView("cards")
                    }}
                />
            </div>
        </div>
        {
            pageView==="cards" ?
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {
                    usersList.map((item: IUser) => (
                        <div className="w-full p-4 border-slate-300 border border-solid shadow-md" key={item.id}>
                            <div className="w-full h-auto lg:h-[250px] bg-blue-300 overflow-hidden flex justify-center items-center">
                                {
                                    !!item?.image ? 
                                    <img src={item?.image} alt="user image" className="w-full h-auto" />
                                    :
                                    <UserIcon className="text-slate-700 w-full h-auto"/>
                                }
                            </div>
                            <h5 className="text-md font-semibold text-center my-4">{item.company_name}</h5>
                            <Button 
                                type="button"
                                isLoading={false}
                                isValid={true}
                                text="View User"
                                onClick={()=>router.push(`/admin/userdetails?id=${item.id}`)}
                            />
                        </div>
                    ))
                }
            </div>
            :
            <div>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Number of users</th>
                            <th>Number of products</th>
                            <th>Percentage</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usersList.map((item:IUser)=>(
                                <tr>
                                    <td>
                                        <div className="flex items-center gap-x-1.5">
                                            <div className="w-[30px] relative h-[30px] bg-blue-300 rounded-full overflow-hidden flex items-center justify-center">
                                                {
                                                    !!item?.image ? 
                                                    <img src={item?.image} alt="user image" className="w-full h-auto" />
                                                    :
                                                    <UserIcon className="text-slate-700 w-full h-auto"/>
                                                }
                                            </div>
                                            <span className="font-semibold">{item.company_name||"--"}</span>
                                        </div>
                                    </td>
                                    <td>{item.users||0}</td>
                                    <td>{item.products||0}</td>
                                    <td>{item.percentage||"0%"}</td>
                                    <td>
                                        <div className="w-[100px]">
                                            <Button
                                                type="button"
                                                isLoading={false}
                                                isValid={true}
                                                text="View User"
                                                className="py-1 px-2 text-sm"
                                                onClick={()=>router.push(`/admin/userdetails?id=${item.id}`)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        }
    </main>
  )
}


export default isAuth(AdminHome)