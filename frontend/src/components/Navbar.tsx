import {Avatar, NavLink} from "@mantine/core";
import {BrainIcon, DatabaseIcon, PlusIcon} from "lucide-react";
import {Link} from "react-router-dom";
import {Assistant, mockAssistants} from "../assistants.ts";
import {useFetch} from "../shared/api.ts";

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
  const assistants = useFetch('/api/assistants') as Assistant[]
  return (
    <div className='clear-link-styles'>
      <MyLink to='/create' leftSection={<PlusIcon />} label="Создать ассистента"/>
      <MyLink to='/assistants' leftSection={<BrainIcon />} label="Все ассистенты"/>
      <MyLink to='/admin' leftSection={<DatabaseIcon />} label="Базы знаний"/>
      <hr color='gray' style={{ opacity: 0.4, width: '100%' }} />
      {/*{mockAssistants.map(({name}, id) => {*/}
      {/*  return (*/}
      {/*    <MyLink to={`/chats/${id}`} key={name} label={name} leftSection={<Avatar name={name}/> }/>*/}
      {/*  );*/}
      {/*})}*/}
      {assistants && assistants.length && assistants.map(({name}, id) => {
        return (
          <MyLink to={`/chats/${id}`} key={name} label={name} leftSection={<Avatar name={name}/> }/>
        );
      })}
    </div>
  );
};
