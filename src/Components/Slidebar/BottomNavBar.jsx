import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoHome, IoHomeOutline, IoSearch, IoSearchOutline, IoAddCircle, IoAddCircleOutline, IoChatbubbleEllipses, IoChatbubbleEllipsesOutline, IoPerson, IoPersonOutline, IoNotifications, IoNotificationsOutline, IoPeople, IoPeopleOutline, IoLogOutOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../GlobalState/auth/Action.js';

const navItems = [
  { title: 'Home', icon: <IoHomeOutline />, activeIcon: <IoHome /> },
  { title: 'Search', icon: <IoSearchOutline />, activeIcon: <IoSearch /> },
  { title: 'Create', icon: <IoAddCircleOutline />, activeIcon: <IoAddCircle /> },
  { title: 'Message', icon: <IoChatbubbleEllipsesOutline />, activeIcon: <IoChatbubbleEllipses /> },
  { title: 'FriendShip', icon: <IoPeopleOutline />, activeIcon: <IoPeople /> },
  { title: 'Notification', icon: <IoNotificationsOutline />, activeIcon: <IoNotifications /> },
  { title: 'Profile', icon: <IoPersonOutline />, activeIcon: <IoPerson /> },
  { title: 'Logout', icon: <IoLogOutOutline />, activeIcon: <IoLogOutOutline />, isLogout: true },
];

const BottomNavBar = ({ onOpenCreate }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();

  const handleTabClick = (item) => {
    if (item.isLogout) {
      localStorage.clear();
      dispatch(logout());
      navigate('/');
      return;
    }
    setActiveTab(item.title);
    if (item.title === 'Profile') {
      navigate('/username');
    } else if (item.title === 'Home') {
      navigate('/');
    } else if (item.title === 'Create') {
      if (onOpenCreate) onOpenCreate();
    } else if (item.title === 'Message') {
      navigate('/message');
    } else if (item.title === 'Notification') {
      navigate('/notification');
    } else if (item.title === 'FriendShip') {
      navigate('/friendship');
    } else if (item.title === 'Search') {
      navigate('/search');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[40] bg-white border-t flex justify-between items-center px-2 py-1 shadow-lg lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.title}
          className={`flex-1 flex flex-col items-center py-1 ${item.isLogout ? 'text-red-600 hover:bg-red-50' : (activeTab === item.title ? 'text-blue-600' : 'text-gray-500')}`}
          onClick={() => handleTabClick(item)}
        >
          <span className="text-lg">{item.isLogout ? item.icon : (activeTab === item.title ? item.activeIcon : item.icon)}</span>
          <span className="text-xs mt-0.5">{item.title === 'Logout' ? 'Đăng xuất' : item.title}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavBar; 