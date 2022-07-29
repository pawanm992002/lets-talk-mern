import { Avatar, HStack, Text } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleFunction }) {
  return (
    <>
      <HStack
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{ background: "#3882AC", color: "white" }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.picture}
        />
        <Text fontSize="xs">{user.name}</Text>
      </HStack>
    </>
  );
}

export default UserListItem;
