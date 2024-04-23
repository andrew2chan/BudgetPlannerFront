import { createMemoryRouter } from "react-router-dom";
import store from '../Redux/store.js';
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import {routes} from "./routes.js";

const customRender = (initialRoutesParam = ["/"]) => {
    const router = createMemoryRouter(routes, { initialEntries: [ ...initialRoutesParam ]} );
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export { customRender }