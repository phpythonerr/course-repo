export default function PageHeader({title, right} : any){

    return (< div className="flex justify-between h-12 bg-white border-b px-3 items-center">
        <div className="font-semibold text-lg">{ title }</div>
        { right && <div>{ right }</div>}
    </div>)

}