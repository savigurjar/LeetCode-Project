// import { useState } from "react";
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from "zod";

// const signupSchema = z.object({
//     firstName: z.string().min(3, "Name should have at least 3 character"),
//     emailId: z.string().email("Invalid Email").trim(),
//     password: z.string().min(8, "Password should be at least 8 character")
// })
// function Signup() {


//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm({ resolver: zodResolver(signupSchema) });



//     const submittedData = (data) => {
//         console.log(data)
//     };
//     return (
//         <>

//             <form onSubmit={handleSubmit(submittedData)} className="flex min-h-screen flex-col justify-center items-center gap-y-5">
//                 <input {...register('firstName')} placeholder="Enter Your firstName" />
//                 {errors.firstName ? (<span>{errors.firstName.message}</span>):null}
//                 <input  {...register('emailId')} placeholder="Enter Your Email" />
//                 {errors.emailId && (<span>{errors.emailId.message}</span>)}
//                 <input {...register('password')} type="password" placeholder="Enter Your Password" />
//                 {errors.password && (<span>{errors.password.message}</span>)}

//                 <input type="submit" className="btn btn-lg" />
//             </form>

//         </>
//     )
// }
// export default Signup;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should have at least 3 characters"),
  emailId: z.string().email("Invalid Email").trim(),
  password: z.string().min(8, "Password should be at least 8 characters")
});

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange", //  validates as you type
  });

  const submittedData = (data) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(submittedData)} className="flex flex-col gap-4">
          
          <div>
            <input 
              {...register('firstName')}
              type="text"
              placeholder="Enter Your First Name"
              className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""}`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-error">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input 
              {...register('emailId')}
              type="email"
              placeholder="Enter Your Email"
              className={`input input-bordered w-full ${errors.emailId ? "input-error" : ""}`}
            />
            {errors.emailId && (
              <p className="mt-1 text-sm text-error">{errors.emailId.message}</p>
            )}
          </div>

          <div>
            <input 
              {...register('password')}
              type="password"
              placeholder="Enter Your Password"
              className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

