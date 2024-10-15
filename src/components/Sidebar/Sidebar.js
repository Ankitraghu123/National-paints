import { HamburgerIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
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
import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink, useLocation } from "react-router-dom";

// Define your routes here
const routes = [
  {
    name: "DashBoard",
    icon: "👤",
    path: "/admin/dashboard",
  },
  {
    name: "Todays Attendance",
    icon: "👤",
    path: "/admin/employee-date-attendance",
  },
  // {
  //   name: "Add Holiday",
  //   icon: "👤",
  //   path: "/admin/dashboard",
  // },
  {
    name: "Add Employee",
    icon: "👤",
    path: "/admin/add-employee",
  },

  {
    name: "Attendance Table",
    icon: "👤",
    path: "/admin/attendance-table",
  },
  {
    name: "Employee",
    icon: "📂", // Icon for dropdown
    path: null, // No path, it's a parent
    subRoutes: [
      {
        name: "Add Attendance",
        icon: "👤",
        path: "/admin/all-employee",
      },
      {
        name: "Date Wise Attendance",
        icon: "👤", // replace with your actual icon component
        path: "/admin/employee-date-attendance",
      },
      {
        name: "Employee Wise Attendance",
        icon: "👤",
        path: "/admin/employee-attendnace",
      },
    ],
  },
];

function Sidebar(props) {
  let location = useLocation();
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  const activeBg = useColorModeValue("white", "navy.700");
  const inactiveBg = useColorModeValue("white", "navy.700");
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("gray.400", "gray.400");
  const sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const createLinks = () => {
    return routes.map((prop, key) => {
      if (prop.subRoutes) {
        return (
          <Box key={key}>
            <Button
              onClick={handleDropdownToggle}
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb="6px"
              mx="auto"
              py="12px"
              borderRadius="15px"
              _hover="none"
              className="css-152ve90"
              w="100%"
              _focus={{ boxShadow: "none" }}
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
                {isDropdownOpen ? (
                  <ChevronUpIcon ml="auto" />
                ) : (
                  <ChevronDownIcon ml="auto" />
                )}
              </Flex>
            </Button>
            <Collapse in={isDropdownOpen}>
              {prop.subRoutes.map((subProp, subKey) => (
                <NavLink to={subProp.path} key={subKey}>
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mb="6px"
                    mx="auto"
                    py="12px"
                    borderRadius="15px"
                    pl="40px" // Indent sub-items
                    _hover="none"
                     className="css-152ve90"
                    w="100%"
                    _focus={{ boxShadow: "none" }}
                  >
                    <Text color={inactiveColor} my="auto" fontSize="sm">
                      {subProp.name}
                    </Text>
                  </Button>
                </NavLink>
              ))}
            </Collapse>
          </Box>
        );
      }

      return (
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
                className="css-152ve90"
              _active={{ bg: "inherit", transform: "none", borderColor: "transparent" }}
              _focus={{ boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)" }}
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
                className="css-152ve90"

              _active={{ bg: "inherit", transform: "none", borderColor: "transparent" }}
              _focus={{ boxShadow: "none" }}
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
      );
    });
  };

  const links = <>{createLinks()}</>;

  const sidebarBg = useColorModeValue("white", "navy.800");
  const sidebarRadius = "20px";
  const sidebarMargins = "0px";
  const brand = (
    <Box pt={"25px"} mb="12px">
      {props.logo}
      <HSeparator my="26px" />
    </Box>
  );

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
            renderTrackVertical={document.documentElement.dir === "rtl" ? renderTrackRTL : renderTrack}
            renderThumbVertical={useColorModeValue(renderThumbLight, renderThumbDark)}
            renderView={document.documentElement.dir === "rtl" ? renderViewRTL : renderView}
          >
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
          </Scrollbars>
        </Box>
      </Box>
    </Box>
  );
}

export function SidebarResponsive(props) {
  let location = useLocation();
  const { logo, hamburgerColor, ...rest } = props;
  const mainPanel = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const activeRoute = (routeName) => location.pathname === routeName ? "active" : "";

  const sidebarBackgroundColor = useColorModeValue("white", "navy.800");

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => setDropdownOpen(!isDropdownOpen);

  const createLinks = () => {
    return routes.map((prop, key) => {
      if (prop.subRoutes) {
        return (
          <Box key={key}>
            <Button
              onClick={handleDropdownToggle}
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb="6px"
              mx="auto"
              py="12px"
              borderRadius="15px"
              _hover="none"
               className="css-152ve90"
              w="100%"
              _focus={{ boxShadow: "none" }}
            >
              <Flex>
                <IconBox
                  bg="gray.100"
                  color="blue.500"
                  h="30px"
                  w="30px"
                  me="12px"
                >
                  {prop.icon}
                </IconBox>
                <Text color="gray.400" my="auto" fontSize="sm">
                  {prop.name}
                </Text>
                {isDropdownOpen ? (
                  <ChevronUpIcon ml="auto" />
                ) : (
                  <ChevronDownIcon ml="auto" />
                )}
              </Flex>
            </Button>
            <Collapse in={isDropdownOpen}>
              {prop.subRoutes.map((subProp, subKey) => (
                <NavLink to={subProp.path} key={subKey}>
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mb="6px"
                    mx="auto"
                    py="12px"
                    borderRadius="15px"
                    pl="40px"
                    _hover="none"
                    w="100%"
                     className="css-152ve90"
                    _focus={{ boxShadow: "none" }}
                  >
                    <Text color="gray.400" my="auto" fontSize="sm">
                      {subProp.name}
                    </Text>
                  </Button>
                </NavLink>
              ))}
            </Collapse>
          </Box>
        );
      }

      return (
        <NavLink to={prop.path} key={key}>
          <Button
            boxSize="initial"
            justifyContent="flex-start"
            alignItems="center"
            bg="transparent"
            mb="6px"
            mx="auto"
            py="12px"
            borderRadius="15px"
             className="css-152ve90"
            _hover="none"
            w="100%"
            _focus={{ boxShadow: "none" }}
          >
            <Flex>
              <IconBox
                bg="gray.100"
                color="blue.500"
                h="30px"
                w="30px"
                me="12px"
              >
                {prop.icon}
              </IconBox>
              <Text color="gray.400" my="auto" fontSize="sm">
                {prop.name}
              </Text>
            </Flex>
          </Button>
        </NavLink>
      );
    });
  };

  return (
    <Box ref={mainPanel}>
      <Button onClick={onOpen} p="0px" bg="transparent" color={hamburgerColor} _focus={{ boxShadow: "none" }}>
        <HamburgerIcon w="24px" h="24px" />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg={sidebarBackgroundColor}>
          <DrawerCloseButton />
          <DrawerBody>
            <Scrollbars
              autoHide
              renderTrackVertical={document.documentElement.dir === "rtl" ? renderTrackRTL : renderTrack}
              renderThumbVertical={useColorModeValue(renderThumbLight, renderThumbDark)}
              renderView={document.documentElement.dir === "rtl" ? renderViewRTL : renderView}
            >
              <Box>
                {logo}
                <HSeparator my="26px" />
              </Box>
              <Stack direction="column" mb="40px">
                <Box>{createLinks()}</Box>
              </Stack>
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Sidebar;