import LoginView from "@/components/auth/login-view";
import AuthLayout from "@/components/layout/auth-layout";
import Head from "next/head";
import Link from "next/link";

export default function Login(){

    return (<>
        <Head>
            <title>Login</title>
        </Head>
        <div className="grid grid-cols-2 h-full">
            <div className="col-span-2 bg-white dark:bg-slate-800 md:col-span-1 h-full">
                <div className="flex h-full w-full justify-center items-center">
                    <div className="px-6 md:px-10 py-10 w-full">
                        <div className="flex justify-center mb-5">
                            <Link href='/' className={`text-base dark:text-white md:text-xl font-bold`}>Login</Link>
                        </div>
                        <LoginView/>
                    </div>
                </div>
            </div>
            <div className="col-span-2 md:col-span-1"></div>
        </div>
    </>)

}

Login.getLayout = function(page: any) {
    return <AuthLayout>{page}</AuthLayout>;
};