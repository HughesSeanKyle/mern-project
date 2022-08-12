import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// Init state for alerts
const initialState = [];

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (action.type) {
		case SET_ALERT:
			return [...state, action.payload];
		case REMOVE_ALERT:
			// Return all id's !== to payload
			return state.filter((alert) => alert.id !== payload);
		default:
			return state;
	}
}

/*
    Reducer: A function that takes in a piece of state. (Any state that has to do with alerts, and an action)
    - An action will get dispatched from an actions file  

    Action: Will contain two things 
        - 1. Type (Mandatory)
            - This is evaluated with a switch statement 
        - 2. Payload (data)
            - Sometime you might not have any data and just call an action type, but with no data. 

*/
