import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { loginUser } from '../features/authSlice';
import { useEffect, useState } from 'react';

//  Backend के field names के according schema
const loginSchema = z.object({
  EmailId: z.string().email("Invalid Email").trim(),
  Password: z.string().min(1, "Password is required")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submittedData = (data) => {
    console.log("Login Data:", data);
    dispatch(loginUser(data));
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )} */}

        <form onSubmit={handleSubmit(submittedData)} className="flex flex-col gap-4">
          <div>
            <input
              {...register('EmailId')}
              type="email"
              placeholder="Enter Your Email"
              className={`input input-bordered w-full ${errors.EmailId ? "input-error" : ""}`}
            />
            {errors.EmailId && (
              <p className="mt-1 text-sm text-error">{errors.EmailId.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register('Password')}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              className={`input input-bordered w-full pr-10 ${errors.Password ? "input-error" : ""}`}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Hide password icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
                </svg>
              ) : (
                // Show password icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {errors.Password && (
              <p className="mt-1 text-sm text-error">{errors.Password.message}</p>
            )}
          </div>


          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
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