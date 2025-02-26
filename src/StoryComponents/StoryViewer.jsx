import { useEffect, useState } from "react"
import styled from "styled-components"
import Progressbar from "./Progressbar"

const StoryViewContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
    flex-direction: column;
`

const StoryImage = styled.img`
    height: 90vh;
    object-fit: contain;
`

const StoryViewer = ({ stories }) => {
    const [currentStoryIndex, setCurrentSoryIndex] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0)

    const handleNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentSoryIndex(currentStoryIndex + 1)
            setActiveIndex(activeIndex + 1)
        }
        else {
            setCurrentSoryIndex(0)
            setActiveIndex(0)
        }
    }

    const handlePrevStory = () => {
        if (currentStoryIndex !== 0) {
            setCurrentSoryIndex(currentStoryIndex - 1)
            setActiveIndex(activeIndex - 1)
        }
        else {
            setActiveIndex(0)
            setCurrentSoryIndex(0)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => handleNextStory(), 2000)
        return () => clearInterval(interval)
    }, [currentStoryIndex])

    return (
        <div>
            <div>
                <StoryViewContainer>
                    <div className="flex w-full">
                        {
                            stories.map((item, index) => (<Progressbar index={index} key={index} activeIndex={activeIndex} duration={2000} />))
                        }
                    </div>
                    <StoryImage src={stories?.[currentStoryIndex].image}>

                    </StoryImage>

                </StoryViewContainer>
            </div>
        </div>
    )
}

export default StoryViewer