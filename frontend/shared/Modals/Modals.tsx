import {useModals} from "./useModals.ts";
import {Button, Group, Input, Modal} from "@mantine/core";
import {FC, useRef} from "react";

interface ContentProps {
  resolve: (result: unknown) => void;
}

 
const ConfirmContent: FC<ContentProps> = ({resolve}) => (
  <Group>
    <Button onClick={() => resolve(true)}>Yes</Button>
    <Button onClick={() => resolve(false)}>No</Button>
  </Group>
);

 
const AlertContent: FC<ContentProps> = ({resolve}) => (
  <Button onClick={() => resolve(true)}>Ok</Button>
);

 
const PromptContent: FC<ContentProps> = ({resolve}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Group>
      <Input placeholder="Enter value" ref={ref}/>
      <Button onClick={() => resolve(ref.current?.value)}>Enter</Button>
    </Group>
  );
};

export const Modals = () => {
  const modals = useModals((state) => state.modals);
  return <>
    {modals.map(({type, message, resolve, close}, i) => <Modal
      opened={true}
      onClose={close}
      key={i}
      title={message}
      centered
    >
      {type === "confirm" && <ConfirmContent resolve={resolve}/>}
      {type === "alert" && <AlertContent resolve={resolve}/>}
      {type === "prompt" && <PromptContent resolve={resolve}/>}
    </Modal>)}
    </>
}