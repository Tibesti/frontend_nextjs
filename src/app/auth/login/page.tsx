'use client';
import { FormikProvider, useFormik } from "formik";
import { TextField } from '@/components/TextField';
import { object, string } from "yup";
import Button from "@/components/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: object({
        email: string().required("Email address is required").email(),
        password: string().required("Password is required")
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values, form)
      setIsLoading(true)
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, values)
      .then(response => response.data)
      .then(function (response) {
        setIsLoading(false)
        if(response.success){
          toast.success(response.message)
          sessionStorage.setItem("user", JSON.stringify(response.data));
          router.push(`/${response.data.user.account_type}`)
        }
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false)
        if(error.response){
          toast.error(error.response.data.message)
        }
      });
    },
  })

  return (
    <main className='p-6'>
      <div className='border-slate-300 border border-solid shadow-md rounded-xl max-w-[400px] block mx-auto my-[60px] p-6 box-border'>
        <h1 className="font-semibold text-center mb-6 text-xl">Login</h1>
        <FormikProvider value={form}>
          <form onSubmit={form.handleSubmit}>
            <TextField
                name="email"
                label="Email Address"
                required={true}
                type="text"
                placeholder="Enter your email address"
            />
            <TextField
                name="password"
                label="Password"
                required={true}
                type="password"
                placeholder="Enter your password"
            />
            <Button
                type="submit"
                isLoading={isLoading}
                isValid={form.isValid}
                text="Login"
            />
          </form>
        </FormikProvider>
      </div>
    </main>
  )
}
