import { useEffect, useState } from "react"
import "./Progressbar.scss"

const Progressbar = ({ index, activeIndex, duration }) => {
    const [progress, setProgress] = useState(0)
    const isActive = index === activeIndex

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => prev < 100 ? prev + 1 : prev);

        }, duration / 100)

        return () => {
            clearInterval(interval)
        }
    }, [activeIndex, duration])

    useEffect(() => {
        setProgress(0)
    }, [activeIndex])

    return (
        <div className={`progress-bar-container ${isActive ? "active":""}`}>
            <div className={isActive ? "progress-bar" : ""} style={{ width: `${progress}%` }}>

            </div>
        </div>
    )
}

export default Progressbar