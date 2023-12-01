'use client';
import { FormikProvider, useFormik } from "formik";
import { TextField } from '@/components/TextField';
import { number, object, string } from "yup";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import isAuth from "@/components/isAuth";
import { auth_token, user_data } from "@/utils/auth_token";
import axios from "axios";
import { toast } from "react-toastify";


function UserHome() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useFormik({
    initialValues: {
      company_name: user_data?.user?.company_name || "",
      users: Number(user_data?.user?.users) || 0,
      products: Number(user_data?.user?.products) || 0,
      percentage: user_data?.user?.percentage || '',
    },
    validationSchema: object({
      company_name: string().required("Company Name is required"),
        users: number().required("Number of users is required"),
        products: number().required("Number of products is required"),
        percentage: string().required("Percentage is required")
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)
      axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${user_data?.user?.id}`, values, {
        headers: {
            "Authorization": `Bearer ${auth_token}`
        }
      })
      .then(response => response.data)
      .then(function (response) {
        setIsLoading(false)
        if(response.success){
          toast.success(response.message)
          sessionStorage.setItem("user", JSON.stringify({
            user: response.data,
            access_token: auth_token
          }))
        }
        console.log(response);
      })
      .catch(function (error) {
        setIsLoading(false)
        if(error.response){
          toast.error(error.response.data.message)
        }
      });
    },
  })

  useEffect(()=>{
    const value = (Number(form.values.products)/Number(form.values.users))*100 || 0
    form.setFieldValue("percentage", `${value.toFixed(2)}%`||"0%")
  }, [form.values.products, form.values.users])

  return (
    <main className='p-6'>
      <div className='rounded-xl max-w-[400px] block mx-auto my-[60px] p-6 box-border'>
        <h1 className="font-semibold text-center mb-6 text-xl">User profile</h1>
        <FormikProvider value={form}>
          <form onSubmit={form.handleSubmit}>
            <TextField
                name="company_name"
                label="Company name"
                required={true}
                type="text"
                placeholder="Enter your company name"
            />
            <TextField
                name="users"
                label="Number of users"
                required={true}
                type="number"
                placeholder="Enter number"
            />
            <TextField
                name="products"
                label="Number of products"
                required={true}
                type="number"
                placeholder="Enter number"
            />
            <TextField
                name="percentage"
                label="Percentage"
                required={true}
                type="text"
                readOnly={true}
            />
            <Button
                type="submit"
                isLoading={isLoading}
                isValid={form.isValid}
                text="Update"
            />
          </form>
        </FormikProvider>
      </div>
    </main>
  )
}


export default isAuth(UserHome)