import { CgSpinner } from "react-icons/cg";

export default function Loading(){

    return (<div className="h-[60vh] flex justify-center items-center">
        <div className="flex flex-col">
            <div className="flex justify-center gap-y-2">
                <span className=""><CgSpinner className="text-2xl animate-spin"/></span>
            </div>
            <div className="flex justify-center">Loading</div>
        </div>
    </div>)

}