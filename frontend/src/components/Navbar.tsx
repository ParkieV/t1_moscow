import {Group, NavLink} from "@mantine/core";
import {BrainIcon, DatabaseIcon, PlusIcon} from "lucide-react";
import {Link} from "react-router-dom";

interface MyLinkProps {
  to: string;
  leftSection?: React.ReactNode;
  label: string;
}

const MyLink = ({to, leftSection, label}: MyLinkProps) => {
  return (
    <Link to={to}>
      <NavLink leftSection={leftSection} label={label}/>
    </Link>
  );
}

export const Navbar = () => {
  return (
    <div className='clear-link-styles'>
      <MyLink to='/create' leftSection={<PlusIcon />} label="Создать ассистента"/>
      <MyLink to='/assistants' leftSection={<BrainIcon />} label="Все ассистенты"/>
      <MyLink to='/admin' leftSection={<DatabaseIcon />} label="Базы знаний"/>
      <hr color='gray' style={{ opacity: 0.4, width: '100%' }} />
      <MyLink to='/chats/1' label="chat 1"/>
      <MyLink to='/chats/2' label="chat 2"/>
      <MyLink to='/chats/3' label="chat 3"/>
    </div>
  );
};
