// import
import Dashboard from 'views/Dashboard/Dashboard.js';
import Tables from 'views/Dashboard/Tables.js';
import Billing from 'views/Dashboard/Billing.js';
import Profile from 'views/Dashboard/Profile.js';
import SignIn from 'views/Pages/SignIn.js';
import SignUp from 'views/Pages/SignUp.js';

import {
	HomeIcon,
	StatsIcon,
	CreditIcon,
	PersonIcon,
	DocumentIcon,
	RocketIcon,
	SupportIcon,
} from 'components/Icons/Icons';

var dashRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: <HomeIcon color="inherit" />,
		component: Dashboard,
		layout: '/admin',
	},
	{
		path: '/tables',
		name: 'Tables',
		icon: <StatsIcon color="inherit" />,
		component: Tables,
		layout: '/admin',
	},
	{
		path: '/billing',
		name: 'Billing',
		icon: <CreditIcon color="inherit" />,
		component: Billing,
		layout: '/admin',
	},
	{
		path: '/profile',
		name: 'Profile',
		icon: <PersonIcon color="inherit" />,
		secondaryNavbar: true,
		component: Profile,
		layout: '/admin',
	},
	{
		// If layout set to admin these comps/routes will appear in the admin layout main panel
		path: '/signin',
		name: 'Sign In',
		icon: <DocumentIcon color="inherit" />,
		component: SignIn,
		layout: '/auth',
	},
	{
		// If layout set to admin these comps/routes will appear in the admin layout main panel
		path: '/signup',
		name: 'Sign Up',
		icon: <RocketIcon color="inherit" />,
		secondaryNavbar: true,
		component: SignUp,
		layout: '/auth',
	},
];

export default dashRoutes;

/* OLD Data structure
var dashRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: <HomeIcon color="inherit" />,
		component: Dashboard,
		layout: '/admin',
	},
	{
		path: '/tables',
		name: 'Tables',
		icon: <StatsIcon color="inherit" />,
		component: Tables,
		layout: '/admin',
	},
	{
		path: '/billing',
		name: 'Billing',
		icon: <CreditIcon color="inherit" />,
		component: Billing,
		layout: '/admin',
	},
	{
		name: 'ACCOUNT PAGES',
		category: 'account',
		state: 'pageCollapse',
		views: [
			{
				path: '/profile',
				name: 'Profile',
				icon: <PersonIcon color="inherit" />,
				secondaryNavbar: true,
				component: Profile,
				layout: '/admin',
			},
			{
				path: '/signin',
				name: 'Sign In',
				icon: <DocumentIcon color="inherit" />,
				component: SignIn,
				layout: '/auth',
			},
			{
				path: '/signup',
				name: 'Sign Up',
				icon: <RocketIcon color="inherit" />,
				secondaryNavbar: true,
				component: SignUp,
				layout: '/auth',
			},
		],
	},
];
*/
