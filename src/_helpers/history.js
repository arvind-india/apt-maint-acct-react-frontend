import { createBrowserHistory } from 'history'

let param = process.env.NODE_ENV === 'production' ?
            {basename: process.env.REACT_APP_API_URL} :
            ''
export const history = createBrowserHistory(param)
