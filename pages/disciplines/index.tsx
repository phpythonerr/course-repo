import Container from "@/components/layout/container";
import Loading from "@/components/loading";
import PageHeader from "@/components/widgets.tsx/page-header";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

export default function Disciplines(){

    const supabase = useSupabaseClient()

    const user = useUser()

    const [disciplines, setDisciplines] = useState<string[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const [success, setSuccess] = useState<boolean | null>(null)

    const [error, setError] = useState<boolean | null>(null)

    useEffect(() => {

        const getDisciplines = async() => {

            try{

                setLoading(true)

                let { data, error } : any = await supabase.from('discipline').select('name, uuid').order('name')

                if (error) throw error

                if(data) setDisciplines(data)

            }
            catch (err){

                throw err

            }
            finally{

                setLoading(false)

            }

        }

        if(user?.id) getDisciplines()
      
    }, [user?.id])

    return (<>
        <Head>
            <title>Disciplines</title>
        </Head>
        <PageHeader title="Disciplines"/>
        <div className="p-3">
        { loading ? (<Loading/>) : (
            <Container>
                <div>
                    <div className="py-5 border-b mb-3">
                        <h3 className="font-medium">Add Discipline</h3>
                        <div className="py-3">
                            <div className="flex gap-3">
                                <div className="w-72">
                                    <input className="py-1 px-3 border rounded w-full" type="text"/>
                                </div>
                                <div>
                                    <button className="py-1 px-3 text-white bg-blue-600 rounded">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    { disciplines.map((discipline) : any => (
                        <p key={discipline?.uuid} className="py-1.5 text-sm">{ discipline?.name }</p>
                    ))}
                </div>
            </Container>
        )}
        </div>
    </>)

}