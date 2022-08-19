import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => (dispatch) => {
	const id = uuid.v4();
	// Dispatch action inside alert reducer which is then filtered through the root reducer to create universal state
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType, id },
	});
};
