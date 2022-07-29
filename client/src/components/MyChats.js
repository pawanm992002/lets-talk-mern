import { Box, Button, useToast, Text, HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

export default function MyChats({ fetchAgain }) {
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        w={{ base: "100%", md: "31%" }}
        p={3}
        border="1px"
        borderRadius="lg"
        height="100%"
        backgroundColor="wheat"
      >
        <HStack justifyContent="space-between" margin="2px 3px 8px 3px">
          <Text fontFamily="work sans" fontSize="x-large" width="fit-content">
            Chats
          </Text>
          <GroupChatModal>
            <Button rightIcon={<AddIcon />}>Group Chat</Button>
          </GroupChatModal>
        </HStack>
        <VStack
          display="flex"
          justifyContent="flex-start"
          margin="8px 3px"
          height="100vh"
          flexWrap="wrap"
          // overflowY="scroll"
        >
          {chats ? (
            chats.map((chat) => (
              <Box
                // width=''
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#3882AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                key={chat._id}
                px={3}
                py={2}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))
          ) : (
            <ChatLoading />
          )}
        </VStack>
      </Box>
    </>
  );
}
