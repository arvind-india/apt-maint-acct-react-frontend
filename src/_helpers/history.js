import { createBrowserHistory } from 'history'

//export const history = createBrowserHistory({basename: '/apt-maint-react'})
export const history = createBrowserHistory({basename: process.env.REACT_APP_DEPLOY_FOLDER})
