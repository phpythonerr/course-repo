import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useFormik } from "formik"
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react"
import * as Yup from 'yup';
import { Error } from '@/components/alert'

export default function LoginView(){

    const [loading, setLoading] = useState(false)

    const [loggedIn, setLoggedIn] = useState(false)

    const [processing, setProcessing] = useState(false)

    const [error, setError] = useState<string | null>()

    const supabase = useSupabaseClient()

    const router = useRouter()

    const user = useUser();

    const redirectTo: any = router.query.redirectedFrom

    const formik = useFormik({
        initialValues: {
          email: '',
          password: ''
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid Email Address').required('Email is Required'),
            password: Yup.string().required('Password is Required')
        }),
        onSubmit: async(values) => {

            try{

                setProcessing(true)

                const { data: signInData, error: signInError } : any = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password
                })

                if(signInError) setError(signInError.message)

                if(signInData.session){

                    setLoggedIn(true)

                    if(redirectTo){

                        router.push(redirectTo)

                    }
                    else{

                        router.push('/')

                    }

                }
                
            }  
            catch (err){
                console.log(err)
            }
            finally{
                setProcessing(false)
            }

        },
        
      });

    return (<>
        {loggedIn && (
            <div className="mb-5">
                <div className="mb-3 px-3 py-1 text-black text-xs md:text-sm rounded bg-green-100 dark:bg-green-50 border border-green-200">Logged In Successfully. If you are not redirected after 5 seconds please <Link href="/" className="underline  text-blue-600 font-medium">Click Here</Link> or refresh the page</div>
            </div>)}
        {error && (<div className="my-5"><Error message={error}/></div>)}
        <form className="text-sm" onSubmit={formik.handleSubmit}>
            <div className="mb-5">
                <div className="mb-2">
                    <label htmlFor="email" className="py-4 dark:text-gray-100">Email<span className="text-red-800 dark:text-red-400">*</span></label>
                </div>
                <input 
                    type="email" 
                    name="email"
                    id="email"
                    className="rounded px-4 border border-gray-400 w-full dark:bg-slate-700 py-2 dark:text-gray-100"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">{formik.errors.email}</div>
                ) : null}
            </div>
            <div className="mb-5">
                <div className="flex justify-between dark:text-gray-100 mb-2">
                    <label htmlFor="email">Password<span className="text-red-800 dark:text-red-400">*</span></label>
                    <Link href="/auth/forgot-password" className="text-blue-600 dark:text-blue-100">Forgot Password?</Link>
                </div>
                
                <input 
                    type="password" 
                    name="password"
                    id="password"
                    className="rounded px-4 border border-gray-400 w-full dark:bg-slate-700 py-2 dark:text-gray-100"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.errors.password && formik.touched.password ? (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">{formik.errors.password}</div>
                ) : null}
            </div>
            <div className="mb-5">
                <button type="submit" disabled={processing} className={`${ processing ? 'bg-blue-400' : 'bg-blue-500'} rounded disabled:cursor-not-allowed disabled:bg-blue-500 text-base w-full text-white py-1.5 font-medium hover:bg-blue-700 flex items-center justify-center`}>
                    <span className="h-full">{ processing ? (<span className="flex h-full items-center"><span>Logging In...</span></span>) : 'Login'}</span>
                </button>
            </div>
        </form>      
    </>)

}