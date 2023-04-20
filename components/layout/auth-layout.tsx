export default function AuthLayout({ children } : any){


    return (<>
        <div className="h-auto md:h-screen bg-gray-100 dark:bg-slate-900">
            { children }
        </div>
    </>)

}