import {NavLink} from "@mantine/core";

export const ChatNavbar = () => {
  return (
    <>
      <NavLink label="Все ассистенты" href="/assistants"/>
      <NavLink label="Создать ассистента" href="/admin/create"/>
      <NavLink label="Базы знаний" href="/admin"/>
    </>
  );
}
