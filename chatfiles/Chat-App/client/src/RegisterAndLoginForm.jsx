import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');

    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault(); 
        
        const url = isLoginOrRegister === 'register' ? 'http://localhost:4040/register' : 'http://localhost:4040/login';
        
        try {
            const response = await axios.post(url, { username, password });
            setLoggedInUsername(username);
            setId(response.data.id); // Use response.data.id correctly
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    }

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
            <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className='p-2 mb-2 block w-full rounded-sm border' 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="object_id" 
                    className='p-2 my-2 block w-full rounded-sm border' 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                />
                <button className="bg-blue-500 p-2 text-white block w-full rounded-sm cursor-pointer">
                    {isLoginOrRegister === 'register' ? 'Go To group chat ' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === 'register' ? (
                        // <div>
                        //     Already a member?  
                        //     <button 
                        //         onClick={() => setIsLoginOrRegister('login')} 
                        //         className="text-blue-500 ml-1 cursor-pointer"
                        //     >
                        //         Login here
                        //     </button>
                        // </div>
                        <div></div>
                    ) : (
                        <div>
                            Don't have an account?  
                            <button 
                                onClick={ () => setIsLoginOrRegister('register')} 
                                className="text-blue-500 ml-1 cursor-pointer"
                            >
                                Register here
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default RegisterAndLoginForm;
