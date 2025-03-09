import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from './Avatar';
import {UserContext} from './UserContext';
import {uniqBy} from "lodash";
import axios from 'axios';

const Chat = () => {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectUserId, setSelectUserId] = useState(null);
    const {username, id} = useContext(UserContext);
    const [newMessageText, setNewMessagetext] = useState("");
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();

    useEffect(() => {
        connectToWs();
    }, []);

    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. trying to reconnect.');
                connectToWs();
            }, 1000);
        });
    }

    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId, username}) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(ev){
       // console.log(ev.data);
        const messageData = JSON.parse(ev.data);
        if('online' in messageData){
           // console.log(messageData.online);
            showOnlinePeople(messageData.online);
        }else if('text' in messageData){
            setMessages(prev => ([...prev, {...messageData}]));
        }
    }

    function selectContact(userId){
        setSelectUserId(userId);
    }

    function sendMessage(ev){
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectUserId,
            text: newMessageText,
        
        }));
        setMessages(prev => ([...prev, {sender: id, text : newMessageText, recipient: selectUserId, _id: Date.now(),}]));
        setNewMessagetext(''); 
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if(div){
            div.scrollIntoView({behaviour: 'smooth', block: 'end'});

        }
    }, [messages]);

    useEffect(() => {
        if(selectUserId){
            axios.get('/messages/' + selectUserId).then(res => {
                const {data} = res;
                setMessages(data);
            });
        }
    }, [selectUserId]);

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlineArr = res.data
            .filter(p => p._id !== id)
            .filter(p => !Object.keys(onlinePeople).includes(p._id));
           // console.log(offlinePeople);
           const offlinep = {};
           offlineArr.forEach(p => {
            offlinep[p._id] = p.username;
           });
           setOfflinePeople(offlinep);
           console.log(offlinePeople);
            
        });
    }, [onlinePeople]);

    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id];
  // console.log("My id", id);
  // console.log({...onlinePeople});

    const messagesWithoutDupes = uniqBy(messages, '_id');
  return (
    <div className = "flex h-screen">
        <div className = "bg-purple-10 w-1/3  pt-4">
        <div className = "pl-4 text-purple-600 font-bold flex gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
            </svg>

            Ghackchat
        </div>
 

            {Object.keys(onlinePeopleExclOurUser).map(userId => (
                <div key = {userId} 
                onClick = {() => selectContact(userId)} 
                className = {"cursor-pointer border-b border-gray-100  flex gap-2 items-center " +(userId === selectUserId? "bg-purple-50" : "")}> 
                {userId === selectUserId && (
                    <div className = "w-1 bg-purple-500 h-10"></div>
                )}
                <div className = "flex gap-2 pl-4 py-2 items-center">
                    <Avatar username = {onlinePeople[userId]} userId = {userId} online = {true}/>
                    <span className = "text-gray-800">{onlinePeople[userId]} </span>
                </div>
                
                </div>
            ))}
            
            {Object.keys(offlinePeople).map(userId => (
                <div key = {userId} 
                onClick = {() => selectContact(userId)} 
                className = {"cursor-pointer border-b border-gray-100  flex gap-2 items-center " +(userId === selectUserId? "bg-purple-50" : "")}> 
                {userId === selectUserId && (
                    <div className = "w-1 bg-purple-500 h-10"></div>
                )}
                <div className = "flex gap-2 pl-4 py-2 items-center">
                    <Avatar username = {offlinePeople[userId]} userId = {userId} online = {false}/>
                    <span className = "text-gray-800">{offlinePeople[userId]} </span>
                </div>
                
                </div>
            ))}



        </div>
        <div className = "flex flex-col bg-purple-100 w-2/3 p-2">
            <div className = "ml-2 flex-grow">
                    {!selectUserId && (
                        <div className = "flex h-full items-center justify-center">
                           <div className = "text-gray-500"> &larr; Select a person</div>
                        </div>
                    )}
                    {!!selectUserId && (
                        <div className = "relative h-full">
                            <div className = "overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map(message => (
                                    <div key = {message._id} className = {(message.sender === id ? 'text-right': 'text-left')}>
                                        <div
                                            className = {"text-left inline-block rounded-xl py-2 px-2 m-2 " + (message.sender === id ? 'bg-purple-600 text-white': 'bg-white text-gray-500')}>
                                            {message.text}
                                        </div>
                                    </div>
                            
                                ))}
                                <div ref = {divUnderMessages}></div>
                            </div>
                        </div>
                    )}
            </div>
           
            {!!selectUserId && (
                <form className = "ml-2 flex gap-2" onSubmit = {sendMessage}>
                <input type = "text" 
                    value = {newMessageText}
                    onChange = {ev => setNewMessagetext(ev.target.value)}
                    className = "flex-grow bg-white border p-2 rounded-xl" 
                    placeholder = "Type your message here"/>
                <button className = "bg-purple-500 p-2 text-white rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                </button>
            </form>
            )}
            
            
        </div>
    </div>
  )
}

export default Chat;