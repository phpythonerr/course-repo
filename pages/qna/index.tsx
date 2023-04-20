import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react";
import Loading from "@/components/loading";
import Container from "@/components/layout/container";
import { Info, Warning } from "@/components/alert";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export default function QnA(){

    const supabase = useSupabaseClient()

    const user = useUser()

    const [essays, setEssays] : any = useState([])

    const [totalEssays, setTotalEssays] = useState<number>(0)

    const [deleting, setDeleting] = useState<string|null>(null)

    const [success, setSuccess] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {

        async function getDisciplines(){
        
            try{

                setLoading(true)

                let { data: essaysData, error: essaysError } : any = await supabase
                .from('qna')
                .select('question, answer, created_at, uuid, slug, discipline (name)')
                .eq('posted_by', user?.id)
                .eq('deleted', false)
                .order('created_at', { ascending: false })
                .limit(50)

                if(essaysData) setEssays(essaysData)

                let { count: essaysCount, error: essaysCountError } : any = await supabase
                .from('qna')
                .select('*', { count: 'exact', head: true})
                .eq('posted_by', user?.id)
                .eq('deleted', false)

                setTotalEssays(essaysCount)

            }
            catch(err){

                throw err

            }
            finally{

                setLoading(false)

            }

        }

        if(user?.id) getDisciplines()

    }, [user?.id])

    const deleteEssay = async(uuid : any) => {

        try{

            setDeleting(uuid)

            const { data: deleteData, error: deleteError } : any = await supabase
                .from('qna')
                .update({
                    deleted: true
                })
                .eq('uuid', uuid)
                .select('deleted')
                .single()

            if(deleteData.deleted){

                setEssays((essays: any[]) => {
                    return essays.filter((essay: any) => essay.uuid != uuid)
                })

                setTotalEssays((total:number) => {
                    return total-1;
                })

            }

        }
        catch(err){

            throw err

        }
        finally{

            setDeleting(null)

        }


    }



    return (<>
        <Head>
            <title>QnA</title>
        </Head>
            <PageHeader title="QnA" right={<Link href="/qna/new" className="bg-amber-600 py-1.5 px-3 rounded text-white text-sm flex items-center"><span className="mr-2"><AiOutlinePlus/></span> <span>Add QnA</span></Link>}/>
        <div className="p-3">
        { loading ? (<Loading/>) : (
            <Container>
                <div>
                    {essays.length <= 0 ? (<Warning message="You have not posted an QnA yet. QnAa You Post will appear here."/>) : (<>
                        <div>
                        <Info message={totalEssays > 50 ? `Showing last 50 Entries out of ${totalEssays}` : `Showing all ${totalEssays} Entries.`}/>
                    </div>
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left">Question</th>
                                <th className="text-left">Discipline</th>
                                <th className="text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            { essays.map((essay: any) => 
                                {return (deleting && deleting === essay?.uuid) ? (<tr key={essay.uuid} className="text-sm border-b">
                                    <td colSpan={3}>
                                        <div className="flex text-red-600 bg-opacity-50 h-10 w-full text-sm justify-center items-center">
                                            Deleting...
                                        </div>
                                    </td>
                                </tr>) : (
                                <tr key={essay.uuid} className="text-sm border-b">
                                    <td className="pr-5 py-2">
                                        <span className="block font-medium">{ essay.question }</span>
                                        <span className="py-1 flex items-center">
                                            <Link href={`/qna/${ essay.slug }/edit`} className="text-blue-600 text-xs">Edit</Link>
                                            <span className="px-3 text-gray-400">|</span>
                                            {(deleting && deleting === essay?.uuid) ? 'Deleting' : (<button onClick={() => deleteEssay(essay.uuid)} type="button" className="text-red-600 text-xs">Delete</button>)}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <span className="block">{ essay?.discipline?.name}</span>
                                    </td>
                                    <td className="pr-5">{ new Date(essay?.created_at).toLocaleString() }</td>
                                </tr>)}
                            )}
                        </tbody>
                    </table>
                    </>)}
                </div>
            </Container>
        )}
        </div>
    </>)

}