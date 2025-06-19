import { Button, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { FaPhotoVideo } from "react-icons/fa"
import "./CreatePostModal.scss"
import { GrEmoji } from "react-icons/gr"
import { GoLocation } from "react-icons/go"
import axiosInstance from "../../AppConfig/axiosConfig"


const CreatePostModal = ({ onClose, isOpen }) => {

    const [isDragOver, setIsDragOver] = useState(false)
    const [file, setFile] = useState()
    const [caption, setCaption] = useState("")
    const [location, setLocation] = useState("")

    const handleDragOver = (event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        setIsDragOver(true)
    }

    const handleDragLeave = () => {
        setIsDragOver(false)
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const droppedFile = event.dataTransfer.files[0]
        const extention = droppedFile.type
        if (extention.startsWith("image/") || extention.startsWith("video/")) {
            setFile(droppedFile)
        }
        else {
            alert("Please select an image or video")
        }
    }

    const handleOnChangeFile = (event) => {
        event.preventDefault()
        const fileSelected = event.target.files[0]
        const extention = fileSelected.type
        if (extention.startsWith("image/") || extention.startsWith("video/")) {
            setFile(fileSelected)
        }
        else {
            setFile(null)
            alert("Please select an image or video")
        }
    }

    const handleCaptionChange = (event) => {
        setCaption(event.target.value)
    }

    const handleSharePost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("location", location);
        formData.append("file", file);


        try {
            const response = await axiosInstance.post(`/api/post`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            alert("Đã đăng bài viết thành công")
            onClose()
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} size={"4xl"} onClose={onClose}>
                <form action="" onSubmit={handleSharePost}>
                    <ModalOverlay />
                    <ModalContent>
                        <div className="flex justify-between py-1 px-10 items-center">
                            <p>Create New Post</p>
                            <Button className="" type="submit" variant={"ghost"} size={"sm"} colorScheme="blue">Share</Button>
                        </div>
                        <hr />
                        <ModalBody>
                            <div className="h-[70vh] justify-between pb-5 flex">
                                <div className="w-[50%]">
                                    {
                                        file ?
                                            (
                                                <img src={URL.createObjectURL(file)} alt="Image" className="h-full w-full" />
                                            ) :
                                            (
                                                <div
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    className="drag-drop h-full"
                                                >
                                                    <div className="text-3xl w-full">
                                                        <FaPhotoVideo />
                                                        <p>Drag photo or videos here</p>
                                                    </div>
                                                    <div className="flex justify-start w-full">
                                                        <label htmlFor="file-upload" className="custom-file-upload">Select from Computer</label>
                                                        <input type="file" id="file-upload" className="input-file" accept="image/*, video/*" onChange={handleOnChangeFile} />
                                                    </div>

                                                </div>
                                            )
                                    }

                                </div>
                                <div className="w-[1px] border-2 h-full">
                                </div>
                                <div className="w-[50%]">
                                    <div className="flex items-center">
                                        <img className="w-7 h-7 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                                        <p className="font-semibold ml-4">username</p>
                                    </div>
                                    <div className="px-2">
                                        <textarea placeholder="Write a caption" name="caption" className="captionInput" rows={8} id="" onChange={handleCaptionChange} value={caption}></textarea>
                                    </div>
                                    <div className="flex justify-between px-2">
                                        <GrEmoji />
                                        <p className="opacity-70 ">{caption.length} /2,200</p>
                                    </div>
                                    <hr />
                                    <div className="p-2 justify-between items-center flex">
                                        <input className="locationInput" type="text" placeholder="location" name="location" value={location} onChange={e => setLocation(e.target.value)} />
                                        <GoLocation />
                                    </div>
                                </div>
                            </div>
                        </ModalBody>


                    </ModalContent>
                </form>
            </Modal>
        </>

    )
}

export default CreatePostModal