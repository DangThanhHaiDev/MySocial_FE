import React, { useState } from 'react';
import { X, Users } from 'lucide-react';

export default function CreateGroupModal({ isOpen, handleClose, handleCreateGroup }) {
    const [groupName, setGroupName] = useState('');

    const handleCreate = () => {
        handleCreateGroup(groupName)
        handleClose()
        setGroupName("")
    }

    return (
        <div className="p-8">


            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                Tạo Nhóm Mới
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <label
                                    htmlFor="groupName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Tên nhóm
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Nhập tên nhóm..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && groupName.trim()) {
                                        }
                                    }}
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    disabled={!groupName.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                                    onClick={handleCreate}

                                >

                                    Tạo nhóm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}