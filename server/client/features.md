<!-- App architecture -->
# Client 
- The app will have two types of state 
- 1. Universal State (Redux store)
- 2. Local State 
    - State is contained within a component and not shared with other components 

<!-- Features -->
# BackLog
- Authentication
- 1. `14/08/2022`
    - At a later stage implement federated signup and signin for fb, google and apple. For now, just focus on standard auth 
# Ready for development
# In Development
- `NOTE! - VERY IMPORTANT`
    - Do this before developing further
        - Deploy to Heroku and set up a deployment pipeline with github actions 
- Authentication
- 1. `14/08/2022` The state contained inside the React hook form does not necessarily be part of universal state (Redux store). However, if a feature is needed where the user's log in attempts need to be limited then form state will have to be universal or at least communicate with universal state via an action ("state updating" helper function)
    - `Recommendation`
        - Start with local form validation then move out to universal state as needed 
    - `14/08/2022 - Completed thus far`
        - Form validation on SignUp inputs and unit tests for SignUp 
# Complete
 
<!-- Bugs -->
# BackLog
# Ready for development
# In Development 
# Complete

<!-- Chores -->
# BackLog
# Ready for development
# In Development 
# Complete