import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
import { Key, useEffect, useState } from "react";
import Loading from "@/components/loading";
import Container from "@/components/layout/container";
import { Info, Warning } from "@/components/alert";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Select from 'react-select'
import TimeAgo from 'timeago-react'; 

export default function Essays(){

    const supabase = useSupabaseClient()

    const user = useUser()

    const [filter, setFilter] = useState<string | null>(null)

    const [filterName, setFilterName] = useState<string | null>(null)

    const [page, setPage] = useState<number | null>(0)

    const [essays, setEssays] : any = useState([])

    const [totalEssays, setTotalEssays] = useState<number>(0)

    const [disciplines, setDisciplines] = useState<any>([])

    const [deleting, setDeleting] = useState<string|null>(null)

    const [success, setSuccess] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        async function getDisciplines(){
        
            try{

                setLoading(true)

                let range_start = 0

                let range_end = 49

                if(page && page > 0){

                    range_start = 0 + (50*page);

                    range_end = range_start + 49

                }

                let { data: disciplineData, error: disciplineError } : any = await supabase.from('discipline').select('name, uuid, course ( name, uuid )').order('name')

                if(disciplineData) setDisciplines(disciplineData)

                if(filter){

                    let { data: essaysData, error: essaysError } : any = await supabase
                    .from('essay')
                    .select('title, body, created_at, approved, uuid, slug, course ( name, discipline (name) )')
                    .eq('course', filter)
                    .eq('posted_by', user?.id)
                    .eq('deleted', false)
                    .order('created_at', { ascending: false })
                    .range(range_start, range_end)

                    if(essaysData) setEssays(essaysData)

                    let { count: essaysCount, error: essaysCountError } : any = await supabase
                    .from('essay')
                    .select('*', { count: 'exact', head: true})
                    .eq('course', filter)
                    .eq('posted_by', user?.id)
                    .eq('deleted', false)

                    setTotalEssays(essaysCount)

                }
                else{

                    let { data: essaysData, error: essaysError } : any = await supabase
                    .from('essay')
                    .select('title, body, created_at, approved, uuid, slug, course ( name, discipline (name) )')
                    .eq('posted_by', user?.id)
                    .eq('deleted', false)
                    .order('created_at', { ascending: false })
                    .range(range_start, range_end)

                    if(essaysData) setEssays(essaysData)

                    let { count: essaysCount, error: essaysCountError } : any = await supabase
                    .from('essay')
                    .select('*', { count: 'exact', head: true})
                    .eq('posted_by', user?.id)
                    .eq('deleted', false)

                    setTotalEssays(essaysCount)

                }

            }
            catch(err){

                throw err

            }
            finally{

                setLoading(false)

            }

        }

        if(user?.id) getDisciplines()

    }, [user?.id, filter, page])

    const deleteEssay = async(uuid : any) => {

        try{

            setDeleting(uuid)

            const { data: deleteData, error: deleteError } : any = await supabase
                .from('essay')
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

    const optgroups: { label: string; options: any[]; }[] = []

    { disciplines?.map((discipline: { uuid: any; name: string; course: object | any }) : any => {
        let options: { label: string; value: Key; }[] = []
        discipline?.course?.map((course : {uuid: Key | string; name: string}) => (
            options.push({label: course?.name, value: course?.uuid})
        ))
        optgroups.push(
            {
                label: discipline.name,
                options: options
            }
        )
    })}

    const handleChange = (selectedOption: any) => {

        setFilter(selectedOption.value)

        setFilterName(selectedOption.label)

    };

    return (<>
        <Head>
            <title>Essays</title>
        </Head>
            <PageHeader title="Essays" right={<Link href="/essays/new" className="bg-amber-600 py-1.5 px-3 rounded text-white text-sm flex items-center"><span className="mr-2"><AiOutlinePlus/></span> <span>Add Essay</span></Link>}/>
        <div className="p-3">
        { loading ? (<Loading/>) : (
            <Container>
                <div>
                    <div className="flex justify-end mb-3">
                        <div className="flex items-center">
                            <div className="mr-2 font-medium">Filter Discipline</div>
                            <div>
                            <Select
                                options={optgroups}
                                name="disciplines"
                                className="w-56 text-sm"
                                onChange={handleChange}
                            />
                            </div>
                            {filter && (<button className="text-sm ml-2 text-blue-600" onClick={() => { setFilter(null); setFilterName(null)}}>Clear Filter</button>)}
                        </div>
                    </div>
                    {essays.length <= 0 ? (<Warning message={`${filterName ? 'You have not posted any ' + filterName + ' essay yet.' : 'You have not posted an essay yet.'} Essays You Post will appear here.`}/>) : (<>
                    <div>
                        <Info message={totalEssays > 50 ? `Showing ${essays?.length} ${filterName ? filterName + ' essays' : 'Entries'} out of ${totalEssays}` : `Showing all ${totalEssays} ${filterName ? filterName + ' essay entries' : 'Entries'}`}/>
                    </div>
                    <div className="py-5 flex flex-wrap items-center">
                        <span className="mr-1 text-sm">Page:</span>
                        {[...Array(Math.ceil(totalEssays/50))].map((e, i) => (
                            <button className={`mx-0.5 text-sm ${ page === i ? '' : 'text-blue-600'}`} key={i} onClick={() => setPage(i)}>{ i + 1 }</button>
                        ))}
                    </div>
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left">Title</th>
                                <th className="text-left">Discipline</th>
                                <th className="text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            { essays.map((essay: { uuid: Key | null | undefined; title: string; slug: string; approved: boolean; course: { discipline: { name: string; }; name: string; }; created_at: any; }) => 
                                {return (deleting && deleting === essay?.uuid) ? (<tr key={essay.uuid} className="text-sm border-b">
                                    <td colSpan={3}>
                                        <div className="flex text-red-600 bg-opacity-50 h-10 w-full text-sm justify-center items-center">
                                            Deleting...
                                        </div>
                                    </td>
                                </tr>) : (
                                <tr key={essay.uuid} className="text-sm border-b">
                                    <td className="pr-5 py-2">
                                        <span className="block font-medium">{ essay.title }</span>
                                        <span className="py-1 flex items-center">
                                            <Link href={`/essays/${ essay.slug }/edit`} className="text-blue-600 text-xs">Edit</Link>
                                            <span className="px-3 text-gray-400">|</span>
                                            {(deleting && deleting === essay?.uuid) ? 'Deleting' : (<button onClick={() => deleteEssay(essay.uuid)} type="button" className="text-red-600 text-xs">Delete</button>)}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <span className="block">{ essay?.course?.discipline?.name + ' - ' + essay?.course.name }</span>
                                    </td>
                                    <td className="pr-5">
                                        <div title={ new Date(essay?.created_at).toLocaleString() }>
                                            <TimeAgo
                                                datetime={essay?.created_at}
                                                locale='en_US'
                                            />
                                        </div>   
                                    </td>
                                </tr>)}
                            )}
                        </tbody>
                    </table>
                    <div className="py-5 flex flex-wrap items-center">
                        <span className="mr-1 text-sm">Page:</span>
                        {[...Array(Math.ceil(totalEssays/50))].map((e, i) => (
                            <button className={`mx-0.5 text-sm ${ page === i ? '' : 'text-blue-600'}`} key={i} onClick={() => setPage(i)}>{ i + 1 }</button>
                        ))}
                    </div>
                    </>)}
                </div>
            </Container>
        )}
        </div>
    </>)

}