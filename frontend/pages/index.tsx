import {Navigate} from "react-router";

export default function Home() {
  return (
    <div>
      <Navigate to='/chats'/>
    </div>
  );
}