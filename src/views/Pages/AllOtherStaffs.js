import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAccountant, getAllHr, getAllReceptionist } from "features/Reception/ReceptionSlice";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { editReceptionist } from "features/Reception/ReceptionSlice";
import { editAccountant } from "features/Reception/ReceptionSlice";
import { editHr } from "features/Reception/ReceptionSlice";
import { deleteReceptionist } from "features/Reception/ReceptionSlice";
import { deleteAccountant } from "features/Reception/ReceptionSlice";
import { deleteHr } from "features/Reception/ReceptionSlice";

const AllOtherSta = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  const allReceptionist = useSelector((state) => state.reception?.allReceptionist);
  const allAccountant = useSelector((state) => state.reception?.allAccountant);
  const allHr = useSelector((state) => state.reception?.allHr);

  const allStaff = [...(allReceptionist || []), ...(allAccountant || []), ...(allHr || [])];

  const {editedAccountant,editedReceptionist,editedHr,deletedAccountant,deletedReceptionist,deletedHr} = useSelector(state => state.reception)

  // State for modal
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editedStaff, setEditedStaff] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    role: ''
  });

  useEffect(() => {
    dispatch(getAllAccountant());
    dispatch(getAllHr());
    dispatch(getAllReceptionist());
  }, [dispatch,editedAccountant,editedReceptionist,editedHr,deletedAccountant,deletedReceptionist,deletedHr]);

  const totalPages = Math.ceil(allStaff?.length / entriesPerPage);
  const currentEmployees = allStaff
    ?.filter((staff) => staff.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditedStaff({
      name: staff.name,
      email: staff.email,
      mobileNumber: staff.mobileNumber,
      role: staff.role,
      id:staff._id
    });
    setEditOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Implement save logic here, such as dispatching anconsole.log('Updated staff details:', editedStaff);
    if(editedStaff.role == 'Reception'){
      dispatch(editReceptionist(editedStaff))
    }else if(editedStaff.role == 'Accountant'){
      dispatch(editAccountant(editedStaff))
    }else{
      dispatch(editHr(editedStaff))
    }
    setEditOpen(false);
  };

  const handleDeleteHandler = (staff) => {
    if(staff.role == 'Reception'){
      dispatch(deleteReceptionist(staff._id))
    }else if(staff.role == 'Accountant'){
      dispatch(deleteAccountant(staff._id))
    }else{
      dispatch(deleteHr(staff._id))
    }
  }

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Search Bar */}
      <Flex justifyContent={'space-between'} id="table-col">
        <Box width={'48%'} mb={4} id="full-width">
          <Text mb={2}>Search by Employee Name:</Text>
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Flex>

      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[50, 75, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>S.No</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Mobile Number</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((staff, idx) => {
              return (
                <Tr key={staff._id}>
                  <Td>{idx + 1}</Td>
                  <Td>{staff.name}</Td>
                  <Td>{staff.role}</Td>
                  <Td>{staff.email}</Td>
                  <Td>{staff.mobileNumber}</Td>
                  <Td>
                    <Flex gap={5}>
                      <Text colorScheme="green" onClick={() => handleEditClick(staff)}>
                        <FaEdit />
                      </Text>
                      <Text colorScheme="red" onClick={() => handleDeleteHandler(staff)}>
                        <MdDelete />
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setEditOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Staff Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={editedStaff.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={editedStaff.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                name="mobileNumber"
                value={editedStaff.mobileNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Role</FormLabel>
              <Input
                name="role"
                value={editedStaff.role}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AllOtherSta;
