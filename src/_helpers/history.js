import { createBrowserHistory } from 'history'

export const history = createBrowserHistory({basename: process.env.REACT_APP_API_URL})
