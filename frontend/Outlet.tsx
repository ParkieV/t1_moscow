import {useRoutes} from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import routes from "~react-pages";

export const Outlet = () => {
  return useRoutes(routes)
}