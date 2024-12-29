import { Button } from "../components/form/Button";
import Logo from "../assets/Logo.jpg";
import taskManagementBg from "../assets/taskManagementBg.png";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${taskManagementBg})` }}>
            <nav className="absolute top-0 left-0 w-full bg-transparent p-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img className="w-9 rounded" src={Logo} alt="logo" />
                    <div className="text-gray-100 font-normal text-xl">Task Management</div>
                </div>
            </nav>
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col justify-between h-52 px-4 py-2 bg-[#d4e4ff] rounded-xl shadow-xl">
                    <div className="flex items-center space-x-3">
                        <img className="w-9 rounded self-center" src={Logo} alt="logo" />
                        <div className="text-center text-xl font-bold text-[#002970] flex justify-center items-center">Task Management</div>
                    </div>
                    <div className="flex flex-col space-y-4 px-16 my-10">
                        <div className="w-48 shadow-md">
                            <Button label={"Sign Up"} onClick={() => navigate("/signup")} />
                        </div>
                        <div className="w-48 shadow-md">
                            <Button label={"Sign In"} onClick={() => navigate("/signin")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};