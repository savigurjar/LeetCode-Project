import React from "react";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useDispatch } from 'react-redux';
import { useNavigate ,Link} from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginUser } from '../features/authSlice';


const signupSchema = z.object({

  emailId: z.string().email("Invalid Email").trim(),
  password: z.string().min(8, "Password should be at least 8 characters")
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema)

  });

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
    }
  },[isAuthenticated,navigate])

  const submittedData = (data) => {
    // console.log(data);
    dispatch(loginUser(data))
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(submittedData)} className="flex flex-col gap-4">


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
            Login
          </button>
           <p className="text-center text-sm">
            Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

