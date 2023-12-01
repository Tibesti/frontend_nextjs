"use client"
import { useField } from 'formik';
import clsx from 'clsx';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';


export const TextField = ({
    ...props
}:{
    label: string;
    required?: boolean;
    name: string
    type: string;
    placeholder?: string;
    readOnly?: boolean;
}) => {
   const [field, meta] = useField(props);
   const [showPassword, setShowPassword] = useState(false)
   const [active, setActive] = useState(false);
   
    return(
        <div className='relative'>
            <label 
                htmlFor={props.name}
                className={clsx( 
                    "text-base text-black",
                    (meta.touched && meta.error && !active) ? 'text-red-500':'text-black',
                )}
            >
                {props.label}
                {
                    props.required &&
                    <span className='text-red-500'>*</span>
                }
            </label>
            <input 
                {...field} 
                {...props} 
                className={`w-full border-[1px] text-gray-500 mt-1 border-solid py-2 px-3 rounded-[5px] focus:outline-none focus:border-green-500 mb-6 ${meta.touched && meta.error ? 'border-red-500':'border-gray-500'}`}
                type={
                    props.type === "password" && showPassword
                        ? "text"
                        : props.type
                }
                onFocus={()=>setActive(true)}
                placeholder={props.placeholder }
                readOnly={props.readOnly}
            />
            {
                props.type==="password" && (
                    showPassword ?
                    <EyeSlashIcon 
                        className='w-[20px] h-5 absolute bottom-[34px] right-[15px]'
                        onClick={()=>setShowPassword(!showPassword)}  
                    />
                    :
                    <EyeIcon 
                        className='w-[20px] h-5 absolute bottom-[34px] right-[15px]'
                        onClick={()=>setShowPassword(!showPassword)}  
                    />
                )
            }
            {
                (meta.touched && meta.error) &&
                <p className='text-red-500 text-xs absolute bottom-[7px]'>{meta.error}</p>
            }
        </div>
    )
}