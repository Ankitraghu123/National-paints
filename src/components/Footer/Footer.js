/eslint-disable/
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";

export default function Footer(props) {
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px='30px'
      pb='20px'>
      <Text
        color='gray.400'
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        &copy; {1900 + new Date().getYear()},{" "}
        <Text as='span'>
          {document.documentElement.dir === "rtl"
            ? " مصنوع من ❤️ بواسطة"
            : "Made by "}
        </Text>
        <Link
          color='blue.400'
          href='https://www.creative-tim.com'
          target='_blank'>
          {document.documentElement.dir === "rtl"
            ? " "
            : "Skyinfogroup "}
        </Link>

        <Link color='blue.400' href='https://www.simmmple.com' target='_blank'>
          {document.documentElement.dir === "rtl" ? "سيممبل " : " "}
        </Link>
        {document.documentElement.dir === "rtl"
          ? ""
          : " "}
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link color='gray.400' href='https://www.creative-tim.com'>
            {document.documentElement.dir === "rtl"
              ? "توقيت الإبداعية"
              : ""}
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link color='gray.400' href='https://www.simmmple.com'>
            {document.documentElement.dir === "rtl" ? "سيممبل" : ""}
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            color='gray.400'
            href='#blog'
            href='https://creative-tim.com/blog'>
            {document.documentElement.dir === "rtl" ? "مدونة" : ""}
          </Link>
        </ListItem>
        <ListItem>
          <Link
            color='gray.400'
            href='#license'
            href='https://www.creative-tim.com/license'>
            {document.documentElement.dir === "rtl" ? "رخصة" : ""}
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}