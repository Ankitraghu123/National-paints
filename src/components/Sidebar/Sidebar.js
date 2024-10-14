import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import {
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderTrackRTL,
  renderView,
  renderViewRTL,
} from "components/Scrollbar/Scrollbar";
import { HSeparator } from "components/Separator/Separator";
// import { SidebarHelp } from "components/Sidebar/SidebarHelp";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink, useLocation } from "react-router-dom";

// Define your routes here
const routes = [
  // {
  //   name: "Dashboard",
  //   icon: "🏠", // replace with your actual icon component
  //   path: "/admin/dashboard",
  // },
  // {
  //   name: "Billing",
  //   icon: "💳", // replace with your actual icon component
  //   path: "/admin/billing",
  // },
  // {
  //   name: "Tables",
  //   icon: "📊", // replace with your actual icon component
  //   path: "/admin/tables",
  // },
  // {
  //   name: "Profile",
  //   icon: "👤", // replace with your actual icon component
  //   path: "/admin/profile",
  // },
  {
    name: "Add Employee",
    icon: "👤", // replace with your actual icon component
    path: "/admin/add-employee",
  },
  {
    name: "All Employee",
    icon: "👤", // replace with your actual icon component
    path: "/admin/all-employee",
  },
  {
    name: "Attendance Table",
    icon: "👤", // replace with your actual icon component
    path: "/admin/attendance-table",
  },
  {
    name: "Employee Wise Attendance",
    icon: "👤", // replace with your actual icon component
    path: "/admin/employee-attendnace",
  },
];

function Sidebar(props) {
  // To check for active links
  let location = useLocation();
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  // Verify if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  // Chakra Color Mode
  const activeBg = useColorModeValue("white", "navy.700");
  const inactiveBg = useColorModeValue("white", "navy.700");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "gray.400");
  const sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";

  // Create the links for the sidebar
  const createLinks = () => {
    return routes.map((prop, key) => (
      <NavLink to={prop.path} key={key}>
        {activeRoute(prop.path) === "active" ? (
          <Button
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            boxShadow={sidebarActiveShadow}
            bg={activeBg}
            transition={variantChange}
            mb="6px"
            mx="auto"
            py="12px"
            borderRadius="15px"
            _hover="none"
            w="100%"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Flex>
              <IconBox
                bg="blue.500"
                color="white"
                h="30px"
                w="30px"
                me="12px"
                transition={variantChange}
              >
                {prop.icon}
              </IconBox>
              <Text color={activeColor} my="auto" fontSize="sm">
                {prop.name}
              </Text>
            </Flex>
          </Button>
        ) : (
          <Button
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            bg="transparent"
            mb="6px"
            mx="auto"
            py="12px"
            borderRadius="15px"
            _hover="none"
            w="100%"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            <Flex>
              <IconBox
                bg={inactiveBg}
                color="blue.500"
                h="30px"
                w="30px"
                me="12px"
                transition={variantChange}
              >
                {prop.icon}
              </IconBox>
              <Text color={inactiveColor} my="auto" fontSize="sm">
                {prop.name}
              </Text>
            </Flex>
          </Button>
        )}
      </NavLink>
    ));
  };

  const links = <>{createLinks()}</>;

  // Sidebar Background and Brand
  const sidebarBg = useColorModeValue("white", "navy.800");
  const sidebarRadius = "20px";
  const sidebarMargins = "0px";
  const brand = (
    <Box pt={"25px"} mb="12px">
      {props.logo}
      <HSeparator my="26px" />
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{ sm: "16px" }}
          my={{ sm: "16px" }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
          borderRadius={sidebarRadius}
        >
          <Scrollbars
            autoHide
            renderTrackVertical={
              document.documentElement.dir === "rtl"
                ? renderTrackRTL
                : renderTrack
            }
            renderThumbVertical={useColorModeValue(
              renderThumbLight,
              renderThumbDark
            )}
            renderView={
              document.documentElement.dir === "rtl"
                ? renderViewRTL
                : renderView
            }
          >
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
            {/* <SidebarHelp sidebarVariant={props.sidebarVariant} /> */}
          </Scrollbars>
        </Box>
      </Box>
    </Box>
  );
}

// Responsive Sidebar component
export function SidebarResponsive(props) {
  // Check for active links
  let location = useLocation();
  const { logo, hamburgerColor, ...rest } = props;
  const mainPanel = React.useRef();

  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  // Color variables
  const sidebarBackgroundColor = useColorModeValue("white", "navy.800");

  // Create the links for the responsive sidebar
  const { isOpen, onOpen, onClose } = useDisclosure(); // Move useDisclosure here

  const createLinks = () => {
    return routes.map((prop, key) => (
      <NavLink to={prop.path} key={key} onClick={onClose}> {/* Call onClose here */}
        <Button
          justifyContent="flex-start"
          alignItems="center"
          bg={activeRoute(prop.path) === "active" ? "blue.500" : "transparent"}
          color={activeRoute(prop.path) === "active" ? "white" : "gray.600"}
          w="100%"
          mb="6px"
          borderRadius="15px"
          py="12px"
          _hover={{ bg: "blue.500", color: "white" }}
          _focus={{ boxShadow: "none" }}
        >
          <Flex>
            <IconBox
              bg={activeRoute(prop.path) === "active" ? "blue.600" : "transparent"}
              color={activeRoute(prop.path) === "active" ? "white" : "blue.500"}
              h="30px"
              w="30px"
              me="12px"
            >
              {prop.icon}
            </IconBox>
            <Text fontSize="sm">{prop.name}</Text>
          </Flex>
        </Button>
      </NavLink>
    ));
  };

  const links = <>{createLinks()}</>;

  // Brand
  const brand = (
    <Box pt={"35px"} mb="8px">
      {logo}
      <HSeparator my="26px" />
    </Box>
  );

  // SIDEBAR
  const btnRef = React.useRef();

  return (
    <Flex display={{ sm: "flex", xl: "none" }} ref={mainPanel} alignItems="center">
      <HamburgerIcon
        color={hamburgerColor}
        w="18px"
        h="18px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        size="full" // Keep full height for the drawer
      >
        <DrawerOverlay />
        <DrawerContent
          transition="all 0.4s ease"
          my={{ sm: "16px" }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
          maxW="70%" // Set max width to 70%
          mx="auto" // Center the drawer
        >
          <DrawerCloseButton _focus={{ boxShadow: "none" }} _hover={{ boxShadow: "none" }} />
          <DrawerBody maxW="100%" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              {/* <SidebarHelp /> */}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
