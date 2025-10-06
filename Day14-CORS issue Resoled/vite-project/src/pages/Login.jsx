import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { loginUser } from '../features/authSlice';
import { useEffect } from 'react';

//  Backend के field names के according schema
const loginSchema = z.object({
  EmailId: z.string().email("Invalid Email").trim(),
  Password: z.string().min(1, "Password is required")
});

function Login() {
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
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
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

          <div>
            <input 
              {...register('Password')}
              type="password"
              placeholder="Enter Your Password"
              className={`input input-bordered w-full ${errors.Password ? "input-error" : ""}`}
            />
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