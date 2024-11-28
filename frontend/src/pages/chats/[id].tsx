import {ActionIcon, Avatar, Box, Card, Container, Group, Input, Stack, Text} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import {SendIcon} from "lucide-react";
import {useParams} from "react-router";
import {Assistant, mockAssistants} from "../../assistants.ts";
import {useTheme} from "../../main.tsx";
import {handledFetch, useFetch} from "../../shared/api.ts";

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
  const [assistants, setAssistants] = useState(mockAssistants)
  const a = useFetch('/api/assistants') as Assistant[]
  useEffect(() => {
    if (!a || !a.length) return
    setAssistants(a)
    setMessages([...defaultMessages.slice(0, -1), {role: 'bot', text: 'Я бот ' + a[+id!].name}]);
    setTheme({main_color:a[+id!].main_color, theme:a[+id!].theme})
  }, [a]);
  const {id} = useParams()
  const {setTheme} = useTheme();

  const [messages, setMessages] = useState<Message[]>([...defaultMessages]);

  useEffect(() => {
    setMessages([...defaultMessages.slice(0, -1), {role: 'bot', text: 'Я бот ' + assistants[+id!].name}]);
    setTheme({main_color:assistants[+id!].main_color, theme:assistants[+id!].theme})
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

  const send = async () => {
    if (!input) return
    setMessages(prevMessages => [...prevMessages, { role: 'user', text: input }]);
    setInput(''); // Clear input field
    const resp = await handledFetch(`/api_ml/assistants/${assistants[+id!].id}/query`, {
      body: input,
      method: 'POST'
    })
    const message = await resp.json()
    setMessages(prevMessages => [...prevMessages, { role: 'bot', text: message }])
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
              <Avatar size='xl' name={assistants?.[+id!].name} color='custom'/>
              <Text size='xl'>{assistants?.[+id!].description}</Text>
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
