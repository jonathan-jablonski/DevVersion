import React from 'react';

export const CTX = React.createContext();
const initState = {
    Mongo: [
        { from: 'Rich', msg: 'Yo'},
        { from: 'Brian', msg: 'Sup'},
        { from: 'Jenn', msg: 'Hello'},

    ],
    Javascript: [ 
        { from: 'Kao', msg: 'Hey'},
        { from: 'Sheena', msg: 'Hello'},
        { from: 'Celina', msg: 'Hello'},
    ], 
    Node: [ 
        { from: 'Cigi', msg: 'Hey'},
        { from: 'Vincent', msg: 'Sup'},
        { from: 'Jonathan', msg: 'Hey guys'},
    ],
}

function reducer(state, action) {
    const {from, msg, topic} = action.payload;
    switch(action.type) {
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

    const reducerHook = React.useReducer(reducer, initState)

    return ( 
        <CTX.Provider value={reducerHook}>
            {props.children}
        </CTX.Provider>
    )
}