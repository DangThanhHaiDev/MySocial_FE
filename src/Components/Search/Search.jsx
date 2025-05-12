import { CloseButton } from "@chakra-ui/react"
import "./Search.scss"
import SearchUserCard from "./SearchUserCard"

const Search = ({handleCloseSearch}) => {
    return (
        <div className="searchContainer relative">
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
            <CloseButton onClick={handleCloseSearch} className="absolute top-0 right-0" />
        </div>
    )
}

export default Search