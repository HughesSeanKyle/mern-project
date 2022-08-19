import {
	render,
	screen,
	cleanup,
	fireEvent,
	act,
	waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from './SignUp';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import React, { useState as useStateMock } from 'react';
import { createMemoryHistory } from 'history';

// Clean up all state used before running next test
beforeEach(cleanup);

describe('<SignUp />', () => {
	it('renders the Signup page', () => {
		const { getByText } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		expect(getByText(/Register with/i)).toBeInTheDocument();
	});

	it('renders 4 input components', () => {
		const { getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		expect(getByTestId('sign-up-input-username')).toBeInTheDocument();
		expect(getByTestId('sign-up-input-email')).toBeInTheDocument();
		expect(getByTestId('sign-up-input-password')).toBeInTheDocument();
		expect(getByTestId('sign-up-input-confirm-password')).toBeInTheDocument();
	});

	it('Should check if signUp form input fields are empty', async () => {
		const { getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		expect(getByTestId('sign-up-input-username')).toHaveValue('');
		expect(getByTestId('sign-up-input-email')).toHaveValue('');
		expect(getByTestId('sign-up-input-password')).toHaveValue('');
		expect(getByTestId('sign-up-input-confirm-password')).toHaveValue('');
	});

	it('Should have enabled signUp btn on init render', async () => {
		const { getByText } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);
		expect(getByText(/SIGN UP/i).closest('button')).toBeEnabled();
	});

	it('Should validate inputs when signup is clicked and no input information is present', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Simulate SignUp button click (Act)
		await act(async () => {
			fireEvent.submit(getByTestId('sign-up-button'));
		});

		// Assert
		expect(
			getByText('Your username should be more than two characters')
		).toBeInTheDocument();
		expect(getByText('Invalid Email')).toBeInTheDocument();
		expect(
			getByText(
				'Password must contain minimum 8 characters, atleast one lowercase letter, uppercase letter, number'
			)
		).toBeInTheDocument();
		expect(getByText('Confirm Password is required')).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	it('Should validate username input when touched, no info provided and touch ends', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Simulate click on field and leave without providing info (Act)
		await act(async () => {
			fireEvent.click(getByTestId('sign-up-input-username'));
			fireEvent.focusOut(getByTestId('sign-up-input-username'));
		});

		// Assert
		expect(
			getByText('Your username should be more than two characters')
		).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	// Test for more than 12 chars on username
	it('Should validate username input when touched, more than 12 characters provided and touch ends', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Provide more than 12 chars as username
		await act(async () => {
			// Confirmed if value has changed - Updated
			fireEvent.change(getByTestId('sign-up-input-username'), {
				target: { value: 'This-Username-Is-More-Than-12-Characters' },
			});
			fireEvent.focusOut(getByTestId('sign-up-input-username'));
		});

		// Assert
		expect(
			getByText('Your username cannot be more than 12 characters')
		).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	it('Should validate email input when touched, no info provided and touch ends', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Simulate click on field and leave without providing info (Act)
		await act(async () => {
			fireEvent.click(getByTestId('sign-up-input-email'));
			fireEvent.focusOut(getByTestId('sign-up-input-email'));
		});

		// Assert
		expect(getByText('Invalid Email')).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	it('Should validate password input when touched, no info provided and touch ends', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Simulate click on field and leave without providing info (Act)
		await act(async () => {
			fireEvent.click(getByTestId('sign-up-input-password'));
			fireEvent.focusOut(getByTestId('sign-up-input-password'));
		});

		// Assert
		expect(
			getByText(
				'Password must contain minimum 8 characters, atleast one lowercase letter, uppercase letter, number'
			)
		).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	it('Should validate password confirm input when touched, no info provided and touch ends', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Simulate click on field and leave without providing info (Act)
		await act(async () => {
			fireEvent.click(getByTestId('sign-up-input-confirm-password'));
			fireEvent.focusOut(getByTestId('sign-up-input-confirm-password'));
		});

		// Assert
		expect(getByText('Confirm Password is required')).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	// Test if confirm password matches value provided in password input
	it('Should validate if the password provided in password input matches value provided in confirm password input', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Provide more than 12 chars as username
		await act(async () => {
			// Confirmed if value has changed - Updated
			fireEvent.change(getByTestId('sign-up-input-password'), {
				target: { value: '@Test1234' },
			});

			fireEvent.focusOut(getByTestId('sign-up-input-password'));

			fireEvent.change(getByTestId('sign-up-input-confirm-password'), {
				target: { value: '@Test123' },
			});

			// User could either focus out or submit. Validation err should still appear
			fireEvent.submit(getByTestId('sign-up-button'));
		});

		// Assert
		expect(getByText('Passwords must and should match')).toBeInTheDocument();
		expect(getByTestId('sign-up-button').closest('button')).toBeDisabled();
	});

	// Assert if signIn link is available
	it('renders the signin link', () => {
		const { getByText } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		expect(getByText(/Sign In/i)).toBeInTheDocument();
	});

	it('Should have signup enabled when correct info in inputs', async () => {
		// Arrange
		const { getByText, getByTestId } = render(
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		);

		// Provide more than 12 chars as username
		await act(async () => {
			fireEvent.change(getByTestId('sign-up-input-username'), {
				target: { value: 'test_user' },
			});

			fireEvent.change(getByTestId('sign-up-input-email'), {
				target: { value: 'test_user@gmail.com' },
			});

			fireEvent.change(getByTestId('sign-up-input-password'), {
				target: { value: '@Test1234' },
			});

			fireEvent.change(getByTestId('sign-up-input-confirm-password'), {
				target: { value: '@Test1234' },
			});

			fireEvent.focusOut(getByTestId('sign-up-input-confirm-password'));
		});

		// Assert
		expect(getByTestId('sign-up-button').closest('button')).toBeEnabled();
	});
});
