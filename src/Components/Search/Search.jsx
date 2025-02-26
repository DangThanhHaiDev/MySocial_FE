import "./Search.scss"
import SearchUserCard from "./SearchUserCard"

const Search = () => {
    return (
        <div className="searchContainer">
            <div className="px-3 py-5">
                <h1 className="text-left p-[10px]  text-xl pb-5">Search</h1>
                <input type="text" placeholder="Search..." className="searchInput" />
            </div>
            <hr />
            <div className="px-3 pt-5 pl-[10px]">
                {
                    [1, 2, 3, 4, 5, 6].map((item, index) => (<SearchUserCard />))
                }
            </div>
        </div>
    )
}

export default Search