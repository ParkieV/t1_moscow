import {Outlet} from "./Outlet.tsx";
import {useCurrentUser} from "./zustand/user.ts";
import {Navigate} from "react-router";
import {Layout} from "./Layout.tsx";
import {Navbar} from "./components/Navbar.tsx";

export function App() {
  const {user} = useCurrentUser();
  if (!user) return <>
    <Outlet/>
    <Navigate to='/auth'/>
  </>;
  return <Layout>
    <Outlet/>
  </Layout>
}
