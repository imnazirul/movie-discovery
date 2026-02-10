import { useSearchParams } from "next/navigation"

const Page = () => {
    const queryType = useSearchParams().get('type')
    const queryValue = useSearchParams().get('value')
    const Genre = useSearchParams().get('genre')
   
    return <div>Movies</div>
}

export default Page;