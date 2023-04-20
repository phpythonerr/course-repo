export function Success({ message } : any){

    return (<div className="py-1.5 px-3 text-sm rounded border border-green-200 bg-green-50 text-green-800 mb-5 w-full">{ message }</div>)

}

export function Info({ message } : any){

    return (<div className="py-1.5 text-sm border border-blue-200 px-3 rounded bg-blue-50 text-blue-800 mb-5 w-full">{ message }</div>)

}

export function Warning({ message } : any){

    return (<div className="py-1.5 border border-amber-200 text-sm px-3 rounded bg-amber-50 text-amber-800 mb-5 w-full">{ message }</div>)

}

export function Error({ message } : any){

    return (<div className="py-1.5 border border-red-200 text-sm px-3 rounded bg-red-50 text-red-800 mb-5 w-full">{ message }</div>)

}