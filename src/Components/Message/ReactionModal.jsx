import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Text,
  Flex,
  Box,
  Badge
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaAngry, FaLaugh, FaSadTear, FaSurprise, FaThumbsUp } from "react-icons/fa";
import axiosInstance from "../../AppConfig/axiosConfig";

const REACTIONS = [
  { id: 1, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
  { id: 2, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
  { id: 3, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
  { id: 4, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
  { id: 5, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
  { id: 6, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
];

const ReactionModal = ({ isOpen, onClose, reactions = [], postId = null }) => {

  const [fetchedReactions, setFetchedReactions] = useState([]);
  const dataToRender = postId !== null ? fetchedReactions : reactions;


  useEffect(() => {
    if (postId !== null) {
      getReactionByPost()
    }
  }, [postId, isOpen])


  const getReactionByPost = async () => {
    try {
      const response = await axiosInstance.get(`/api/post/reaction/${postId}`)
      setFetchedReactions(response.data)
      console.log(response.data);
      
    } catch (error) {

    }
  }

  const groupedReactions = dataToRender.reduce((acc, reaction) => {
    const type = reaction.reaction.reactionType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(reaction);
    return acc;
  }, {});

  const getReactionIcon = (type) => {
    return REACTIONS.find(r => r.type === type)?.icon;
  };

  const getReactionTitle = (type) => {
    return REACTIONS.find(r => r.type === type)?.title;
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={2}>
            <Text>Cảm xúc</Text>
            <Badge colorScheme="blue" variant="solid" borderRadius="full">
              {dataToRender.length}
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {dataToRender.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              Chưa có ai react tin nhắn này
            </Text>
          ) : (
            <Box>
              {Object.entries(groupedReactions).map(([reactionType, userReactions]) => (
                <Box key={reactionType} mb={4}>
                  {/* Header cho từng loại reaction */}
                  <Flex align="center" gap={2} mb={2} p={2} bg="gray.50" borderRadius="md">
                    <Box fontSize="xl">
                      {getReactionIcon(reactionType)}
                    </Box>
                    <Text fontWeight="semibold" color="gray.700">
                      {getReactionTitle(reactionType)}
                    </Text>
                    <Badge variant="outline" colorScheme="gray" borderRadius="full">
                      {userReactions.length}
                    </Badge>
                  </Flex>

                  {/* Danh sách user đã react */}
                  {userReactions.map((reaction, index) => (
                    <Flex
                      key={`${reactionType}-${reaction.user.id}-${index}`}
                      align="center"
                      gap={3}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "gray.50" }}
                      transition="background-color 0.2s"
                    >
                      <Avatar
                        size="sm"
                        src={reaction.user.avatarUrl}
                        name={`${reaction.user.firstName} ${reaction.user.lastName}`}
                      />
                      <Box flex={1}>
                        <Text fontWeight="medium" color="gray.800">
                          {reaction.user.firstName} {reaction.user.lastName}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {reaction.user.email}
                        </Text>
                      </Box>
                      <Box fontSize="lg">
                        {getReactionIcon(reactionType)}
                      </Box>
                    </Flex>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReactionModal;