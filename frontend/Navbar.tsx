import {NavLink} from "@mantine/core";

export const Navbar = () => {
  return (
    <>
      <NavLink label="chat 1" href="/chats/1"/>
      <NavLink label="chat 2" href="/chats/2"/>
      <NavLink label="chat 3" href="/chats/3"/>
    </>
  );
}