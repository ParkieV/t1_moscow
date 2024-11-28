import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  ColorInput,
  colorsTuple,
  Container,
  FileInput,
  Group,
  Input,
  MantineProvider,
  Radio,
  Space,
  Stack,
  TextInput,
  Title,
  useMantineColorScheme
} from "@mantine/core";
import {useRef, useState} from "react";
import {FilesDropzone} from "../components/FilesDropzone.tsx";
import {BrainIcon, MinusIcon, PlusIcon} from "lucide-react";
import {handledFetch} from "../shared/api.ts";

export default function Create() {
  const [urls, setUrls] = useState<string[]>(['']);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [color, setColor] = useState('#5f6dc7');
  const avatarInputRef = useRef<HTMLButtonElement | null>(null);
  const {colorScheme, setColorScheme} = useMantineColorScheme()

  // {
  //   "name": "string",
  //   "icon": "string",
  //   "main_color": "string",
  //   "theme": "dark",
  //   "website_url": "string"
  // }

  const submit = () => {
    handledFetch('/api/assistants/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzMyOTczMDQ1fQ.lLrQUDKhFM-sTeiCMe_-F9zEWQZ_QSfWFg_lAkOV4Xs'}`,
        'Content-Type': 'application/json', // Ensure this header is set
      },
      body: JSON.stringify({
        name: "asasdfaiisdfsadjfdf",
        icon: "",
        main_color: "#829030",
        theme: "dark",
        website_url: "string"
      }),
    });
  }


  return (
    <MantineProvider theme={{
      primaryColor: 'custom',
        colors: {
          custom: colorsTuple(Array(10).fill(color)),
        }
    }}>
      <Container>
        <Title>Создание ассистента</Title>

        <Space h='xl'/>
        <FileInput accept='image/*' onChange={(files) => setAvatar(files)} style={{display: 'none'}} ref={avatarInputRef}/>
        <Avatar src={avatar ? URL.createObjectURL(avatar) : undefined} name={name} size={100} onClick={() => avatarInputRef?.current?.click()} style={{cursor: 'pointer'}}/>

        <Space h='xl'/>
        <Title order={3}>Имя ассистента</Title>
        <TextInput placeholder='Имя ассистента' value={name} onChange={(e) => setName(e.currentTarget.value)}/>

        <Space h='xl'/>
        <Title order={3}>Темы</Title>
        <Group>
          <Box>
            <img src='/dark.png' width={200}/>
            <Radio value='dark' checked={colorScheme === 'dark'} onChange={() => setColorScheme('dark')} label={'Темная'}/>
          </Box>
          <Box>
            <img src='/light.png' width={200}/>
            <Radio value='light' checked={colorScheme === 'light'} onChange={() => setColorScheme('light')} label={'Светлая'}/>
          </Box>
        </Group>

        <Space h='xl'/>
        <Title order={3}>Основной цвет</Title>
        <ColorInput placeholder='Основной цвет' value={color} onChange={(e) => setColor(e)}/>

        <Space h='xl'/>
        <FilesDropzone addFiles={files => setFiles(files)} files={files}/>

        <Space h='xl'/>
        <Title order={3}>Ссылки на сайты для обучения</Title>
        <Stack>
          {urls.map((url, i) => (
              <Input key={i} value={url}
                     placeholder='https://notion.so'
                     onChange={(e) => {
                const newUrls = [...urls];
                newUrls[i] = e.currentTarget.value;
                setUrls(newUrls);
              }}/>
          ))}
          <Group><ActionIcon><PlusIcon onClick={() => setUrls([...urls, ''])}/></ActionIcon>
            <ActionIcon><MinusIcon onClick={() => setUrls(urls.slice(0, urls.length - 1))}/></ActionIcon></Group>
        </Stack>

        <Space h='xl'/>
        <Button leftSection={<BrainIcon/>} w={'100%'} onClick={submit}>Создать ассистента</Button>
        <Space h='100px'/>
      </Container>
    </MantineProvider>
  );
}
