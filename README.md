# apt-maint-acct-react-frontend  
Exploring React & Redux frameworks by re-implementing a tiny application on Apartment Maintenance Account, that was earlier written in Angular.  


Features:  
1. Authentication using JSON Web Token (JWT),  
2. Authorizations using Hierarchical Role Based Access Control (RBAC),   
3. App Login, Registration, Forgot Password, Social Logins  
4. NodeJS backend  
5. Base code for future projects  


## Demo  
A read-only demo is [here](http://eastgate.in/apt-maint-acct-react-frontend-demo).  


## Backend  
A backend for this application, written in NodeJS/ExpressJS, is available. Please refer  [here](https://github.com/mohankumaranna/apt-maintenance-account-backend).  


## Installation  
_Step 1:_  Clone or Download this front-end application into a folder.  
_Step 2:_  `npm install or yarn install`.  
_Step 3:_  Rename `env_sample file` to `.env` and make necessary updates in it, such as _API_URL, Social IDs, DEPLOY FOLDER_  
_Step 4:_  Update homepage entry in `package.json` to specify deploy folder, say `/my-react-app/`  
_Step 5:_  `npm build` or `yarn build`.  It creates __build__ folder with deployable files  
_Step 6:_  Copy this __build__ folder into the hosting site and rename it to `my-react-app` or whatever name selected in the previous step  
_Step 7:_  On the browser, enter URL, say http://www.myhost.com/my-react-app.  It shows the home page of this application  


## License  
MIT  
