import Aside from "./aside";

export default function Base({ children } : any){

    return (<>
    <div className="h-screen">
        <header className="h-14 border-b fixed bg-white w-full"></header>
        <div className="flex w-full h-screen pt-14">
            <Aside/>
            <main className="flex-grow bg-gray-100 overflow-y-auto">{ children }</main>
        </div>
    </div>
    </>)

}