# apt-maint-acct-react-frontend  
Exploring React & Redux frameworks by re-implementing a simple application on Apartment Maintenance Account, which was earlier written in Angular.  


Features:  
1. Authentication using JSON Web Token (JWT),  
2. Authorizations using Hierarchical Role Based Access Control (RBAC),   
3. App Login, Registration, Forgot Password, Social Logins  
4. NodeJS backend  
5. Base code for future projects  


## Demo  
For a demo, please click [here](http://eastgate.in/apt-maint-acct-react-frontend-demo).  
Please note that demo has read-only permissions  


## Backend  
A backend for this application is available. Please refer  [here](https://github.com/mohankumaranna/apt-maintenance-account-backend))  


## Installations  
_Step 1:_  Clone or Download this front-end application into a folder.  
_Step 2:_  `npm install or yarn install`.  
_Step 3:_  Rename env_sample file to .env and make necessary updates in it, such as API_URL, Social IDs, DEPLOY FOLDER
_Step 4:_  Update homepage entry in package.json to specify deploy folder, say '/my-react-app/'
_Step 5:_  `npm build` or `yarn build`.  It creates 'build' folder with deployable files
_Step 6:_  Copy this 'build' folder into the hosting site and rename it to 'my-react-app' or whatever name selected in the previous step
_Step 7:_  On the browser, enter URL, say http://www.myhost.com/my-react-app.  It shows the home page of this application


## License  
MIT  
  
