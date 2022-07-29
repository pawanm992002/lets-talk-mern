import {
  MenuItem,
  MenuList,
  Button,
  Tooltip,
  MenuButton,
  Text,
  Menu,
  HStack,
  Avatar,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SearchIcon, ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
  const { setSelectedChat, user, chats, setChats } = ChatState();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const btnRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const LogOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "enter user info into search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error while searching ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <HStack
        bgColor="#353535"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderRadius="10px"
        spacing="5px"
      >
        <Tooltip label="search user to chat" hasArrow placement="bottom">
          <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text>Let's Talk</Text>
        <HStack spacing="5px">
          <Menu>
            <MenuButton>
              <BellIcon />
            </MenuButton>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuItem onClick={LogOutHandler}>LOG OUT</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User : </DrawerHeader>

          <DrawerBody>
            <HStack>
              <Input
                placeholder="Type here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </HStack>
            <VStack>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((obj) => {
                  return (
                    <UserListItem
                      key={obj._id}
                      user={obj}
                      handleFunction={() => accessChat(obj._id)}
                    />
                  );
                })
              )}
            </VStack>
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
