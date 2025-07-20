import React from 'react'
import { Avatar, Button, Badge } from '@chakra-ui/react'
import url from '../../AppConfig/urlApp'
import { useNavigate } from 'react-router-dom'

const SearchUserCard = ({ user, searchReason, mutualFriendsCount, isFriend }) => {
    const navigate  = useNavigate()



    const getReasonBadge = () => {
        const reasonMap = {
            'FRIEND': { text: 'Bạn bè', color: 'green' },
            'MUTUAL_FRIEND': { text: 'Bạn chung', color: 'blue' },
            'SAME_PROVINCE': { text: 'Cùng tỉnh', color: 'purple' },
            'RANDOM': { text: 'Đề xuất', color: 'gray' }
        }
        
        const reason = reasonMap[searchReason] || reasonMap['RANDOM']
        return (
            <Badge colorScheme={reason.color} size="sm">
                {reason.text}
            </Badge>
        )
    }



 

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg mb-2" onClick={()=>navigate(`/profile/${user.id}`)}>
            <div className="flex items-center space-x-3">
                <Avatar 
                    size="md" 
                    src={url+user.avatarUrl} 
                    name={`${user.firstName} ${user.lastName}`}
                />
                <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h3>
                        {getReasonBadge()}
                    </div>
                    
                    <p className="text-sm text-gray-600">{user.email}</p>
                    
                    {user.address && (
                        <p className="text-xs text-gray-500 mt-1">
                            📍 {user.address}
                        </p>
                    )}
                    
                    {user.biography && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {user.biography}
                        </p>
                    )}
                    
                    {searchReason === 'MUTUAL_FRIEND' && mutualFriendsCount > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                            {mutualFriendsCount} bạn chung
                        </p>
                    )}
                </div>
            </div>
            
            <div className="flex space-x-2">  
                {isFriend && (
                    <Button 
                        size="sm" 
                        colorScheme="green"
                        variant="outline"
                        disabled
                    >
                        Bạn bè
                    </Button>
                )}
            </div>
        </div>
    )
}

export default SearchUserCard