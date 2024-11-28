import {ReactNode} from "react";
import {ActionIcon, AppShell, Box, Burger, Group, useMantineColorScheme} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {Link} from "react-router-dom";
import {SunMoon} from "lucide-react";
import {Modals} from "./shared/Modals";
import {Notifications} from "./shared/Notifications";
import {ReactSVG} from "react-svg";
import {Navbar} from "./components/Navbar.tsx";

export const Layout = ({children}: {children: ReactNode}) => {
  const {colorScheme, setColorScheme} = useMantineColorScheme()

  const changeColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')

  const [opened, {toggle}] = useDisclosure();

  return (
    <AppShell
      header={{height: 60}}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: {mobile: !opened},
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group ml='xl' mr='lg' gap='sm' align='center' h='100%' justify='space-between'>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Link to='/' style={{textDecoration: 'none'}}><Box c='text'>
              <ReactSVG src='/T1-logo.svg' style={{marginLeft: -80}}/>
          </Box></Link>

          <Group>
            <ActionIcon
              variant='default'
              onClick={changeColorScheme}
            >
              <SunMoon/>
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" onClick={toggle} style={{overflowY: 'auto'}}>
        <Navbar/>
      </AppShell.Navbar>

      <AppShell.Main>
        <Modals/>
        <Notifications/>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
