import StoryViewer from "../../StoryComponents/StoryViewer"

const Story = ()=>{
    const Story = [
        {image: "https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg"},
        {image: "https://th.bing.com/th?id=OIP.55xrJdT3ckz5UX55xcVb7QHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2"},
        {image: "https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg"},
        {image: "https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg"},
      

    ]

    return (
        <div>
            <StoryViewer stories={Story} />
        </div>
    )
}

export default Story