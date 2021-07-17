import React from 'react';
import { useEffect } from 'react';


export const CTX = React.createContext();

const initState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
}

function reducer(state, action) {
    const { from, msg, topic } = action.payload;
    switch (action.type) {
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {
                        from,
                        msg
                    }
                ]
            }
        default:
            return state
    }
}



export default function Store(props) {


    const [state, dispatch] = React.useReducer(reducer, initState)

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user])

    return (
        <CTX.Provider value={{ 
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch, }}
            >
            {props.children}
        </CTX.Provider>
    )
}