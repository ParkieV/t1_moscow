import {ActionIcon, Avatar, Box, Card, Container, Group, Input, Stack, Text} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {SendIcon} from "lucide-react";
import {useParams} from "react-router";
import {assistants} from "../../assistants.ts";
import {useTheme} from "../../main.tsx";

const defaultMessages = [
  { role: 'user', text: 'Привет, как дела?' },
  { role: 'bot', text: 'Привет, я бот, у меня все хорошо' },
  { role: 'user', text: 'Кто ты?' },
  { role: 'user', text: 'Кто ты?' },
];

interface Message {
  role: string;
  text: string;
}

export default function Chats() {
  const {id} = useParams()
  const {name, description, main_color, theme} = assistants[+id!]
  const {setTheme} = useTheme();

  const [messages, setMessages] = useState<Message[]>([...defaultMessages, {role: 'bot', text: 'Я бот ' + name}]);
  useEffect(() => {
    setMessages([...defaultMessages.slice(0, -1), {role: 'bot', text: 'Я бот ' + name}]);
    setTheme({main_color, theme})
  }, [id]);
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
            <Stack>
              <Avatar size='xl' name={name} color='custom'/>
              <Text size='xl'>{description}</Text>
            </Stack>
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
