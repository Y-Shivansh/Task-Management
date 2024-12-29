import { Heading } from "../components/form/Heading";
import { Button } from "../components/form/Button";
import { BottomWarning } from "../components/form/BottomWarning";
import { InputBox } from "../components/form/InputBox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const SignUp = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    return (
        <div className="h-screen bg-[#1a5b75] flex flex-col items-center">
            <div className="w-96 mt-20 text-center p-8 bg-gray-200 rounded-xl shadow-lg">
                <Heading label={"Sign up"} />
                <InputBox placeholder="testName" label={"Name"}
                    type={"text"}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }} />
                <InputBox placeholder="example@gmail.com" label={"Email"}
                    type={"email"}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} />
                <InputBox placeholder="123456" label={"Password"}
                    type={"password"}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }} />
                <div className="pt-4">
                    <Button label={"Sign Up"} onClick={async()=>{
                         if (!name || !email || !password) {
                            console.log("All fields are required.");
                            return;
                        }
                        try{
                            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/auth/register`,{
                                name,
                                email,
                                password
                            })
                            if (response.status===200) {
                                localStorage.setItem('token', response.data.token)
                                navigate("/dashboard");
                            } else {
                                console.log("Signup failed: ", response.data.message);
                            }
                        }
                        catch(err){
                            console.log("Error Signing up: ", err.data);
                        }
                    }}/>
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign In"} to={"/signin"} />
            </div>
        </div>
        // </div>
    );
};
