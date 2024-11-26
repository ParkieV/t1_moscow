import {ActionIcon, AppShell, Box, Burger, Group, Title, useMantineColorScheme} from "@mantine/core";
import {Modals} from "./shared/Modals";
import {Notifications} from "./shared/Notifications";
import {Navbar} from "./components/Navbar";
import {Outlet} from "./Outlet.tsx";
import {useDisclosure} from '@mantine/hooks';
import {Link} from "react-router-dom";
import {SunMoon} from "lucide-react";

export function App() {
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
            <Title>
              GPT EXTENDED
            </Title>
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

      <AppShell.Navbar p="md">
        <Navbar/>
      </AppShell.Navbar>

      <AppShell.Main>
        <Modals/>
        <Notifications/>
          <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
}