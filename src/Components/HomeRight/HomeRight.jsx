import SuggetionCard from "./SuggetionCard"

const HomeRight = () => {
    return (
        <div>
            <div>
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div>
                                <img className="h-12 w-12 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                            </div>
                            <div className="text-left ml-3">
                                <p>FullName</p>
                                <p className="opacity-70">username</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-blue-700 font-semibold">Swith</p>
                        </div>
                    </div>
                    <div className="flex items-center mt-5 justify-between">
                        <p className="text-sm font-semibold opacity-70">Suggestions for you</p>
                        <p className="text-sm font-semibold ">See All</p>
                    </div>
                    <div className="space-y-5 mt-5">
                        {
                            [1, 2, 3, 4].map((item) => (
                                <SuggetionCard />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeRight