import {FC, useRef} from 'react';
import {Badge, Button, Code, Group, Stack, Text} from '@mantine/core';
import {Dropzone} from '@mantine/dropzone';
import {FilesIcon} from "lucide-react";

interface FilesDropzoneProps {
  addFiles: (files: File[]) => void;
  files: File[];
}

export const FilesDropzone: FC<FilesDropzoneProps> = ({addFiles, files}) => {
  const openRef = useRef<() => void>(null);

  return (
    <Dropzone openRef={openRef} onDrop={addFiles} activateOnClick={false}>
      <Stack justify="center" align='center'>
        <Stack justify="center" align='center' w={350}>
          <FilesIcon size={50}/>
          <Text ta='center' fw={500}>Файлы для обучения ассистента pdf, txt, docs</Text>
          <Group justify='center'>
            {files.map((file, i) => (
              <Code key={i}>{file.name}</Code>
            ))}
          </Group>
          <Button onClick={() => {
            openRef.current?.()
          }} style={{pointerEvents: 'all'}}>
            Select files
          </Button>
        </Stack>
      </Stack>
    </Dropzone>
  );
}
