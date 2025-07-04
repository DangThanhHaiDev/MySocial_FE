import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Icon,
  VStack
} from '@chakra-ui/react';
import { AiOutlineWarning } from 'react-icons/ai';

const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = "item", 
  message, 
  itemName,
  isLoading = false 
}) => {
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx={4} borderRadius="xl">
        <ModalHeader pb={2}>
          <VStack spacing={3} align="center">
            <Icon 
              as={AiOutlineWarning} 
              w={12} 
              h={12} 
              color="red.500"
              bg="red.50"
              p={2}
              borderRadius="full"
            />
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Xác nhận xóa {type}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={4}>
          <VStack spacing={3} align="center" textAlign="center">
            <Text color="gray.600" fontSize="md">
              {message || `Bạn có chắc chắn muốn xóa ${type} này không?`}
            </Text>
            
            {itemName && (
              <Text 
                fontSize="sm" 
                color="gray.500" 
                bg="gray.50" 
                px={3} 
                py={1} 
                borderRadius="md"
                fontStyle="italic"
              >
                "{itemName}"
              </Text>
            )}
            
            <Text fontSize="sm" color="red.500" fontWeight="medium">
              Hành động này không thể hoàn tác!
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button 
            variant="ghost" 
            onClick={onClose}
            isDisabled={isLoading}
            _hover={{ bg: "gray.100" }}
          >
            Hủy
          </Button>
          <Button 
            colorScheme="red" 
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText="Đang xóa..."
            _hover={{ bg: "red.600" }}
          >
            Xóa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;