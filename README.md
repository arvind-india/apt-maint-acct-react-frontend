# apt-maint-acct-react-frontend  
Exploring React & Redux frameworks by re-implementing a tiny application on Apartment Maintenance Account, that was earlier written in Angular.  


Features:  
1. Authentication using JSON Web Token (JWT),  
2. Authorizations using Hierarchical Role Based Access Control (RBAC),   
3. App Login, Registration, Forgot Password, Social Logins  
4. NodeJS backend  
5. Base code for future projects  


## Demo  
A read-only demo is [here](http://eastgate.in/apt-maint-react-demo).  


## Backend  
A backend for this application, written in NodeJS/ExpressJS, is available. Please refer  [here](https://github.com/mohankumaranna/apt-maintenance-account-backend).  


## Installation  

Steps to be followed:  

1. Clone or Download this front-end application into a folder.  

2. `npm install or yarn install`.  

3. Rename `env_sample file` to `.env` and make necessary updates in it, such as API_URL, Social IDs  

4. Update homepage entry in `package.json` to specify deploy folder, say `/my-react-app/` (as mentioned in API URL above)  

5. `npm build` or `yarn build`.  It creates __build__ folder with deployable files  

6. Copy this __build__ folder into the hosting site and rename it to `my-react-app` or whatever name selected in the previous step  

7. On the browser, enter URL, say http://www.myhost.com/my-react-app.  It shows the home page of this application  


## License  
MIT  
