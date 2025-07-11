import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Flex,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import CommentCard from "../CommentCard/CommentCard.jsx";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { MdClose, MdImageNotSupported } from "react-icons/md";
import "./Comment.scss";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import url from "../../AppConfig/urlApp.js";

const CommentModal = ({
  onClose,
  isOpen,
  comments,
  sendComment,
  postId,
  commentTreeReloadKey,
  imageUrl,
  render
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentTree, setCommentTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const textareaRef = useRef(null);
  const commentsSectionRef = useRef(null);
  
  const user = useSelector((state) => state.auth.user);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  
  const postOwnerId =
    commentTree.length > 0 && commentTree[0].postOwnerId
      ? commentTree[0].postOwnerId
      : comments && comments[0] && comments[0].postOwnerId
      ? comments[0].postOwnerId
      : null;

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [commentText]);

  useEffect(() => {
    if (postId && isOpen) {
      setLoading(true);
      setError(null);
      
      axiosInstance
        .get(`/api/comment/posts/${postId}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setCommentTree(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setCommentTree([]);
          setError("Không thể tải bình luận. Vui lòng thử lại.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, postId, commentTreeReloadKey, comments]);

  const handleSendComment = async () => {
    if (!commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await sendComment(commentText.trim(), null);
      setCommentText("");
      
      // Scroll to bottom after sending comment
      setTimeout(() => {
        if (commentsSectionRef.current) {
          commentsSectionRef.current.scrollTop = commentsSectionRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Error sending comment:", err);
      setError("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (replyText, parentId) => {
    try {
      await sendComment(replyText, parentId);
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Không thể gửi phản hồi. Vui lòng thử lại.");
    }
  };

  const handleDeleteComment = (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const socket = new SockJS(
        `${window.location.origin.replace("3000", "2208")}/ws?token=${token}`
      );
      const client = Stomp.over(socket);
      client.connect({}, () => {
        client.send(`/app/comments/delete/${commentId}`, {}, "");
        setTimeout(() => client.disconnect(), 500);
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Không thể xóa bình luận. Vui lòng thử lại.");
    }
  };

  const handleEditComment = (commentId, newContent) => {
    try {
      const token = localStorage.getItem("token");
      const socket = new SockJS(
        `${window.location.origin.replace("3000", "2208")}/ws?token=${token}`
      );
      const client = Stomp.over(socket);
      client.connect({}, () => {
        client.send(
          `/app/comments/update/${postId}`,
          {},
          JSON.stringify({ id: commentId, content: newContent })
        );
        setTimeout(() => client.disconnect(), 500);
      });
    } catch (err) {
      console.error("Error editing comment:", err);
      setError("Không thể chỉnh sửa bình luận. Vui lòng thử lại.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const filteredComments = commentTree.filter((item) => !item.deleted);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"} isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent maxH="90vh" bg={bgColor}>
        <ModalBody p={0}>
          <Flex h="80vh" position="relative">
            {/* Close Button */}
            <IconButton
              aria-label="Close modal"
              icon={<MdClose />}
              position="absolute"
              top={2}
              right={2}
              zIndex={10}
              size="sm"
              variant="ghost"
              onClick={onClose}
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
            />

            {/* Image Section */}
            <Box w="45%" position="relative" bg="black" display="flex" alignItems="center" justifyContent="center">
              {imageLoading && (
                <Flex position="absolute" inset={0} alignItems="center" justifyContent="center">
                  <Spinner size="xl" color="white" />
                </Flex>
              )}
              
              {imageError ? (
                <Flex direction="column" alignItems="center" color="gray.400">
                  <MdImageNotSupported size={48} />
                  <Text mt={2} fontSize="sm">Không thể tải ảnh</Text>
                </Flex>
              ) : (
                <img
                  src={url + imageUrl}
                  alt="Post content"
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: imageLoading ? 'none' : 'block'
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </Box>

            {/* Comments Section */}
            <Box w="55%" display="flex" flexDirection="column">
              {/* Header */}
              <Box p={4} borderBottom="1px" borderColor={borderColor}>
                <Text fontSize="lg" fontWeight="semibold">
                  Tất cả Bình luận ({filteredComments.length})
                </Text>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert status="error" size="sm">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Comments List */}
              <Box 
                ref={commentsSectionRef}
                flex={1} 
                overflowY="auto" 
                p={4}
                className="comment-scroll"
              >
                {loading ? (
                  <Flex justifyContent="center" py={8}>
                    <Spinner size="lg" />
                  </Flex>
                ) : filteredComments.length === 0 ? (
                  <Flex 
                    direction="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    py={12}
                    color="gray.500"
                  >
                    <FaRegComment size={32} />
                    <Text mt={3} fontSize="md">
                      Chưa có bình luận nào
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Hãy là người đầu tiên bình luận!
                    </Text>
                  </Flex>
                ) : (
                  <Box>
                    {filteredComments.map((item, index) => (
                      <Box key={item.id} mb={index < filteredComments.length - 1 ? 4 : 0}>
                        <CommentCard
                          comment={item}
                          onReply={handleReply}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                          currentUserId={user?.id}
                          postOwnerId={postOwnerId}
                          img={item.user?.avatarUrl}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Comment Input */}
              <Box 
                p={4} 
                borderTop="1px" 
                borderColor={borderColor}
                bg={bgColor}
              >
                <Flex gap={3} alignItems="flex-end">
                  <Box flex={1}>
                    <textarea
                      ref={textareaRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="commentInput w-full text-left resize-none overflow-hidden"
                      placeholder="Thêm bình luận..."
                      rows={1}
                      style={{
                        minHeight: '40px',
                        maxHeight: '120px',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: `1px solid ${borderColor}`,
                        fontSize: '14px',
                        lineHeight: '1.4',
                        fontFamily: 'inherit'
                      }}
                      disabled={isSubmitting}
                    />
                  </Box>
                  <Button
                    onClick={handleSendComment}
                    isLoading={isSubmitting}
                    loadingText="Gửi"
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                    px={6}
                    isDisabled={!commentText.trim() || isSubmitting}
                    rightIcon={<RiSendPlaneLine />}
                  >
                    Gửi
                  </Button>
                </Flex>
                
                {/* Character count hint */}
                {commentText.length > 800 && (
                  <Text 
                    fontSize="xs" 
                    color={commentText.length > 1000 ? "red.500" : "gray.500"}
                    textAlign="right"
                    mt={1}
                  >
                    {commentText.length}/1000
                  </Text>
                )}
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;