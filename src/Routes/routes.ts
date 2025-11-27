import { createBrowserRouter } from "react-router";
import App from "../App";
import HomePage from "../Pages/Home/HomePage";

export const routePath = {
    home: '/home',
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: routePath.home,
                Component: HomePage,
            },
        ],
    },
]);
