import {ActionIcon, Box, Card, Container, Group, Input, Stack} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import {SendIcon} from "lucide-react";
import {useParams} from "react-router";
import {Layout} from "../../Layout.tsx";
import {Navbar} from "../../components/Navbar.tsx";

const defaultMessages = [
  { role: 'user', text: 'Hello!' },
  { role: 'bot', text: 'Hi there!' },
  { role: 'user', text: 'How are you?' },
  { role: 'bot', text: 'I am good, thank you!' },
  { role: 'user', text: 'That is great to hear!' },
  { role: 'bot', text: 'Yes, it is!' },
  { role: 'user', text: 'Goodbye!' },
  { role: 'bot', text: 'Goodbye!' },
];

interface Message {
  role: string;
  text: string;
}

export default function Chats() {
  const {id} = useParams()

  const [messages, setMessages] = useState<Message[]>([...defaultMessages, {role: 'bot', text: 'Hello this chat is for ' + id}]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };


  // useEffect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    if (!input) return
    setMessages(prevMessages => [...prevMessages, { role: 'user', text: input }]);
    setInput(''); // Clear input field
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && input.trim()) {
      event.preventDefault(); // Prevent default input action if necessary
      send()
    }
  };

  return (
      <Stack h='calc(100vh - 100px)' justify='end'>
      <Stack style={{ overflowY: 'auto' }}>
        <Container w='100%'>
          <Stack>
            <Box w='100%'/>
            {messages.map((message, index) => (
              <Card key={index} style={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {message.text}
              </Card>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

        </Container>
      </Stack>
      <Container w='100%'>
        <Group>
          <Input
            flex={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown} // Attach event here
            placeholder='Type a message...'
          />
          <ActionIcon size='lg' onClick={send}><SendIcon/></ActionIcon>
        </Group>
      </Container>
    </Stack>
  )
}
