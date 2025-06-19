const SuggetionCard = ()=>{
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <img className="h-9 w-9 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                <div className="text-left ml-3">
                    <p className="text-sm font-semibold">Username</p>
                    <p className="text-sm font-semibold opacity-70">Follows you</p>
                </div>
            </div>
            <p className="text-sm text-blue-700 font-semibold">Add friend</p>
        </div>
    )
}

export default SuggetionCard