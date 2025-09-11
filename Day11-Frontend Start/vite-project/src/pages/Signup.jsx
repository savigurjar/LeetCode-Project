import { useState } from "react";
import { useForm } from 'react-hook-form';
function Signup() {


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     console.log(name,email,password)
    //     // validation -- validname,valid email ,valid password

    //     // form ko submit kr denge

    //     // backend me submite
    // }

    const submittedData = (data) => {
        console.log(data)
    };
    return (
        <>

            {/* <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-2">

                <input type="text" value={name} placeholder="Enter Your FirstName" onChange={(e) => setName(e.target.value)}></input>
                <input type="email" value={email} placeholder="Enter Your Email " onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" value={password} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Submit</button>
            </form> */}



            <form onSubmit={handleSubmit(submittedData)}>
                <input {...register('firstName')} placeholder="Enter Your firstName" />
                <input  {...register('email')} placeholder="Enter Your Email" />
                <input {...register('password')} placeholder="Enter Your Password" />

                <input type="submit" className="btn btn-lg" />
            </form>

        </>
    )
}
export default Signup;