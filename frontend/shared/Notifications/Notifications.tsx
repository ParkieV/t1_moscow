import {Box, Notification, Space, Text} from "@mantine/core";
import {useNotifications} from "./useNotifications.ts";
import {Fragment} from "react";


export const Notifications = () => {
  const notifications = useNotifications(state => state.notifications);
  return <>
    <Box pos='fixed' top={10} right={10} style={{zIndex: 1000}}>
      {notifications.map(({error, remove, animation, message}, i) => <Fragment key={i}>
        <Notification
          loading={!error}
          onClose={remove}
          className={animation ? "close" : "show"}
          style={{transition: "all 0.5s ease-in-out"}}
          title={message}
        >
          {error && <Text c='red'>{error}</Text>}
        </Notification>
        <Space h="sm"/>
      </Fragment>)}
    </Box>
  </>
}