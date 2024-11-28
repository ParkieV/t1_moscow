import {Outlet} from "./Outlet.tsx";
import {useCurrentUser} from "./zustand/user.ts";
import {Navigate} from "react-router";
import {Layout} from "./Layout.tsx";
import {colorsTuple, MantineProvider, useMantineColorScheme} from "@mantine/core";
import {useTheme} from "./main.tsx";
import {useEffect} from "react";

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
