import React, { useContext } from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm'
import { UserContext } from './UserContext.jsx'
import Chat from './Chat.jsx';

const Routes = () => {

    const {username, id } = useContext(UserContext);

    if(username){
        return <Chat/>;
    }   
    return (
        <RegisterAndLoginForm/>
        
    )
}

export default Routes;