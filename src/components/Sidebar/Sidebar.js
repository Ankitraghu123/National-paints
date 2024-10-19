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
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { FaCalendarAlt } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosPeople, IoMdPeople } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { isAdmin } from "utils/config";
import { isHR } from "utils/config";
import { isReceptionist } from "utils/config";
import { isAccountant } from "utils/config";

// Define your routes here
const routes = [
  {
    name: "DashBoard",
    icon: "👤",
    path: "/admin/dashboard",
  },
  {
    name: "Add Holiday",
    icon: <FaCalendarAlt />,
    path: "/admin/add-holiday",
  },
  {
    name: "Add Attendance",
    icon: "👤",
    path: "/admin/all-employee",
  },
 
  {
    name: "Employees",
    icon: <IoIosPeople />, // Icon for dropdown
    path: null, // No path, it's a parent
    subRoutes: [
      {
        name: "Add Employee",
        icon: "👤",
        path: "/admin/add-employee",
      },
      {
        name: "All Employees",
        icon: "👤",
        path: "/admin/all-employee-table",
      },
      {
        name: "UnApproved Employees",
        icon: "👤",
        path: "/admin/unapproved-employee",
      },
      {
        name: "UnPaid Employees",
        icon: "👤",
        path: "/admin/unpaid-employee",
      },
      
    ],
  },
  

  
    ...(isHR() || isAdmin() ? 
    [
    {
      name: "Labour",
      icon: <IoIosPeople />, // Icon for dropdown
      path: null, // No path, it's a parent
      subRoutes: [
        {
          name: "Labour Attendance",
          icon: "👤",
          path: "/admin/attendance-table",
        },
        {
          name: "Date Wise Attendance",
          icon: "👤", // replace with your actual icon component
          path: "/admin/employee-date-attendance",
        },
        {
          name: "Month Wise Attendance",
          icon: "👤",
          path: "/admin/employee-attendnace",
        },
      ],
    },
    {
      name: "Staff",
      icon: <IoPeople />, 
      path: null, 
      subRoutes: [
        {
          name: "Staff Attendance",
          icon: "👤", 
          path: "/admin/staff-attendance-table",
        },
        {
          name: "Date Wise Attendance",
          icon: "👤", 
          path: "/admin/staff-datewise-attendance-table",
        },
        {
          name: "Month Wise Attendance",
          icon: "👤", 
          path: "/admin/staff-monthwise-attendance-table",
        },
        
      ],
    },
    {
      name: "Sales",
      icon: <FaPeopleCarryBox />, 
      path: null, 
      subRoutes: [
        {
          name: "Sales Attendance",
          icon: "👤",
          path: "/admin/sales-attendance-table",
        },
        {
          name: "Date Wise Attendance",
          icon: "👤",
          path: "/admin/sales-datewise-attendance-table",
        },
        {
          name: "Month Wise Attendance",
          icon: "👤",
          path: "/admin/sales-monthwise-attendance-table",
        },
      ],
    },] : []),
  
  
 
 
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

  const [openDropdown, setOpenDropdown] = useState(null); // Manages open dropdowns by index

  const handleDropdownToggle = (key) => {
    setOpenDropdown(openDropdown === key ? null : key); // Toggles dropdown
  };

  const createLinks = () => {
    return routes.map((prop, key) => {
      if (prop.subRoutes) {
        return (
          <Box key={key}>
            <Button
              onClick={() => handleDropdownToggle(key)}
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
                {openDropdown === key ? (
                  <ChevronUpIcon ml="auto" />
                ) : (
                  <ChevronDownIcon ml="auto" />
                )}
              </Flex>
            </Button>
            <Collapse in={openDropdown === key}>
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
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  const hamburgerColorMobile = useColorModeValue("gray.500", "white");
  const sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
  const sidebarBg = useColorModeValue("white", "navy.800");
  const variantChange = "0.2s linear";
  const [openDropdown, setOpenDropdown] = useState(null); // Manages open dropdowns by index

  const handleDropdownToggle = (key) => {
    setOpenDropdown(openDropdown === key ? null : key); // Toggles dropdown
  };

  const createLinks = () => {
    return routes.map((prop, key) => {
      if (prop.subRoutes) {
        return (
          <Box key={key}>
            <Button
              onClick={() => handleDropdownToggle(key)} 
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
                  bg="transparent"
                  color="blue.500"
                  h="30px"
                  w="30px"
                  me="12px"
                  transition={variantChange}
                >
                  {prop.icon}
                </IconBox>
                <Text color="gray.400" my="auto" fontSize="sm">
                  {prop.name}
                </Text>
                {openDropdown === key ? (
                  <ChevronUpIcon ml="auto" />
                ) : (
                  <ChevronDownIcon ml="auto" />
                )}
              </Flex>
            </Button>
            <Collapse in={openDropdown === key}>
              {prop.subRoutes.map((subProp, subKey) => (
                <NavLink to={subProp.path} key={subKey} onClick={onClose}>
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
        <NavLink to={prop.path} key={key} onClick={onClose}>
          {activeRoute(prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              boxShadow={sidebarActiveShadow}
              bg="blue.500"
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
                  bg="transparent"
                  color="blue.500"
                  h="30px"
                  w="30px"
                  me="12px"
                  transition={variantChange}
                >
                  {prop.icon}
                </IconBox>
                <Text color="white" my="auto" fontSize="sm">
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
              className="css-152ve90"
              w="100%"
              _active={{ bg: "inherit", transform: "none", borderColor: "transparent" }}
              _focus={{ boxShadow: "none" }}
            >
              <Flex>
                <IconBox
                  bg="transparent"
                  color="blue.500"
                  h="30px"
                  w="30px"
                  me="12px"
                  transition={variantChange}
                >
                  {prop.icon}
                </IconBox>
                <Text color="gray.400" my="auto" fontSize="sm">
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

  const hamburgerMenu = (
    <HamburgerIcon
      color={hamburgerColor ? hamburgerColor : hamburgerColorMobile}
      w="18px"
      h="18px"
    />
  );

  const brand = (
    <Box pt={"25px"} mb="12px">
      {props.logo}
      <HSeparator my="26px" />
    </Box>
  );

  return (
    <Box ref={mainPanel}>
      <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
        <Button
          onClick={onOpen}
          variant="transparent-with-icon"
          p="0px"
          w="max-content"
          h="max-content"
          colorScheme="none"
        >
          {hamburgerMenu}
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        >
          <DrawerOverlay />
          <DrawerContent
            w="285px"
            maxW="285px"
            ms={{ sm: "16px" }}
            my={{ sm: "16px" }}
            borderRadius="16px"
            bg={sidebarBg}
          >
            <DrawerCloseButton
              _focus={{ boxShadow: "none" }}
  _hover={{ boxShadow: "none" }}
  onClick={onClose}
            />
            <DrawerBody
              maxW="285px"
              px="1rem"
              overflowY="auto"
              filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
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
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
}

export default Sidebar;