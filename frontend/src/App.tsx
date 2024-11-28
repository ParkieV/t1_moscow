import {Outlet} from "./Outlet.tsx";
import {useCurrentUser} from "./zustand/user.ts";
import {Navigate} from "react-router";
import {Layout} from "./Layout.tsx";
import {colorsTuple, MantineProvider, useMantineColorScheme} from "@mantine/core";
import {useTheme} from "./main.tsx";
import {useEffect} from "react";

export function App() {
  const {user} = useCurrentUser();


  const {main_color, theme} = useTheme();
  const {setColorScheme} = useMantineColorScheme()
  useEffect(() => {
    setColorScheme(theme)
  }, [theme])
  if (!user) return <>
    <Outlet/>
    <Navigate to='/auth'/>
  </>;
  return <MantineProvider theme={{
    primaryColor: 'custom',
    colors: {
      custom: colorsTuple(Array(10).fill(main_color)),
    }
  }} defaultColorScheme={theme}>
    <Layout>
      <Outlet/>
    </Layout>
  </MantineProvider>
}
