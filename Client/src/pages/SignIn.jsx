import { BottomWarning } from "../components/form/BottomWarning";
import { Button } from "../components/form/Button";
import { Heading } from "../components/form/Heading";
import { InputBox } from "../components/form/InputBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        try {
            // Make API request
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/auth/login`, {
                email,
                password,
            });

            // Handle successful login
            if (response.status === 200) {
                // Save token and navigate to dashboard
                localStorage.setItem('token', response.data.token);
                window.location.reload();
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Handle invalid credentials
                setError('Invalid email or password');
            } else {
                // Handle other errors
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="h-screen bg-[#1a5b75] flex flex-col justify-center items-center">
            <div className="w-96 text-center p-8 bg-gray-200 rounded-xl shadow-lg">
                <Heading label={"Sign in"} />
                <InputBox
                    label={"Email"}
                    placeholder={"curk@gmail.com"}
                    type={"email"}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <InputBox
                    label={"Password"}
                    placeholder={"12345"}
                    type={"password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <Button label={"Sign In"} onClick={handleSignIn} />
                <BottomWarning text={"Don't have an account?"} linkText={"Sign up"} link={"/signup"} />
            </div>
        </div>
    );
};