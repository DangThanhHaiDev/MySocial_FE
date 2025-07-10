import { Button } from "@chakra-ui/react"
import { useState } from "react"
import CreateGroupModal from "./CreatedGroupModal"
import axiosInstance from "../../AppConfig/axiosConfig"

const Group = () => {
    const [isOpenGroupCreatedModal, setIsOpenGroupCreatedModal] = useState(false)


    const handleCloseGroupCreatedModal = ()=>{
        setIsOpenGroupCreatedModal(false)
    }

    const handleCreateGroup = async(groupName)=>{
        try {
            await axiosInstance.post('/api/groups', {groupName})
            alert("Bạn đã tạo nhóm thành công")
        } catch (error) {
            alert("Lỗi khi tạo nhóm")
        }
    }

    return (
        <div>
            <div className="p-4 border-b bg-gray-50">
                <div className="text-left p-3">
                    <Button size={"sm"} onClick={()=>setIsOpenGroupCreatedModal(true)}>Tạo nhóm</Button>
                </div>
                <input
                    type="text"
                    className="border p-2 rounded w-full mb-2"
                    placeholder="Tìm nhóm để nhắn tin..."
                />

            </div>
            <CreateGroupModal isOpen={isOpenGroupCreatedModal} handleCreateGroup={handleCreateGroup} handleClose={handleCloseGroupCreatedModal}x/>
        </div>
    )
}

export default Group