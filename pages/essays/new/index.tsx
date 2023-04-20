import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextArea } from "@/components/inputs/textarea";
import { Key, useEffect, useState } from "react";
import Loading from "@/components/loading";
import Container from "@/components/layout/container";
import { Success, Warning, Error } from '@/components/alert'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { SelectCourse } from "@/components/inputs/select-course";


export default function NewEssay(){

    const user = useUser()

    const supabase = useSupabaseClient()

    const [disciplines, setDisciplines] : any = useState(null)

    const [success, setSuccess] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [processing, setProcessing ] = useState<boolean>(false)

    const [checkingSimilarity, setCheckingSimilarity] = useState<boolean>(false)

    const [isSimilar, setIsSimilar] = useState<boolean>(false)

    useEffect(() => {

        async function getDisciplines(){
        
            try{

                setLoading(true)

                let { data: disciplineData, error: disciplineError } : any = await supabase.from('discipline').select('name, uuid, course ( name, uuid )').order('name')

                if(disciplineData) setDisciplines(disciplineData)

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

    return (<>
        <Head>
            <title>New Essay</title>
        </Head>
        <PageHeader title="New Essay"/>
        <div className="p-3">
            { loading ? (<Loading/>) : (
            <Container bg="bg-gray-50">
                <Warning message="Text Editor may take a few seconds to load. Please wait until the editor on the 'Essay' field loads completely."/>
                {isSimilar && <Error message="Essay not Uploaded because there is already a similar one"/>}
                <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        { success && <Success message="Essay Added Successfully"/>}
                        <Formik
                            initialValues={{ course: '', title: '', essay: '' }}
                            validationSchema={Yup.object({
                                course: Yup.string().required('Required'),
                                title: Yup.string().required('Required'),
                                essay: Yup.string().required('Required'),
                            })}
                            onSubmit={async(values, { setSubmitting, resetForm }) => {


                                try{

                                    setProcessing(true)

                                    setCheckingSimilarity(true)

                                    let {  count: similarData, error: similarError } : any = await supabase
                                        .from('essay')
                                        .select('*', { count: 'estimated', head: true})
                                        .eq('deleted', false)
                                        .ilike('title', '%'+ values.title +'%')

                                    setCheckingSimilarity(false)

                                    if(similarData === 0){

                                        let body = values.essay.replace('service.ivypanda.com/writing-help','customer.essayheap.com/auth/signup').replace('ivypanda.com','essayheap.com')

                                        let { data: essayData, error: essayError } : any = await supabase.from('essay').insert({
                                            title: values.title,
                                            body: body,
                                            course: values.course,
                                            posted_by: user?.id
                                        })
                                        .select('uuid, slug, course ( slug, discipline (slug))').single()

                                        if(essayData){

                                            let url : string = `https://www.essayheap.com/essays/${essayData?.course?.discipline?.slug}/${essayData?.course?.slug}/${essayData?.slug}`

                                            // const response = await fetch('https://www.bing.com/indexnow?url=' + url + '&key=4a2d5e2f06f0428bb813e7f2da35a36d');

                                            window.scrollTo({ top: 0, behavior: 'smooth'})

                                            setSuccess(true)

                                            resetForm({
                                                values: {
                                                    course: values?.course,
                                                    title: '',
                                                    essay: ''
                                                }
                                            })

                                        }

                                    }
                                    else{

                                        setIsSimilar(true)

                                    }


                                }
                                catch(err){

                                    throw err

                                }
                                finally{


                                    setProcessing(false)

                                }
                                
                            }}
                            >
                            <Form>
                                <div className="mb-3">
                                    <label className="font-medium" htmlFor="course">Course</label>
                                    <div>
                                        <Field 
                                            name="course" 
                                            isMulti={false}
                                            component={SelectCourse} 
                                            className="bg-white z-30 rounded w-full"
                                            options={optgroups}
                                        />
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="course" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="title" className="font-medium">Title</label>
                                    <div>
                                        <Field name="title" as="input" type="text" className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-1 focus:outline-amber-600" />
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="title" />
                                    </div>
                                </div>
                        
                                <div className="mb-3">
                                    <label htmlFor="essay" className="font-medium">Essay</label>
                                    <div>
                                        <Field name="essay" component={TextArea} className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-1 focus:outline-amber-600" />
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="essay" />
                                    </div>
                                </div>
                        
                                <div className="mb-3">
                                    <button type="submit" className="bg-amber-600 text-white py-1.5 px-3 rounded">Submit</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </Container>
            )}
        </div>
    </>)

}