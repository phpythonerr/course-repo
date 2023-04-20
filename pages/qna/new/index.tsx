import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { QnATextArea } from "@/components/inputs/qna-textarea";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Container from "@/components/layout/container";
import { Success, Warning, Error } from '@/components/alert'
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";


export default function NewQnA(){

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

                let { data: disciplineData, error: disciplineError } : any = await supabase.from('discipline').select('name, uuid').order('name')

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

    return (<>
        <Head>
            <title>New QnA</title>
        </Head>
        <PageHeader title="New QnA"/>
        <div className="p-3">
            { loading ? (<Loading/>) : (
            <Container bg="bg-gray-50">
                <Warning message="Text Editor may take a few seconds to load. Please wait until the editor on the 'Essay' field loads completely."/>
                <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        { success && <Success message="Question Added Successfully"/>}
                        <Formik
                            initialValues={{ discipline: '', question: '', answer: '' }}
                            validationSchema={Yup.object({
                                discipline: Yup.string().required('Required'),
                                question: Yup.string().required('Required'),
                                answer: Yup.string().required('Required'),
                            })}
                            onSubmit={async(values, { setSubmitting, resetForm }) => {


                                try{

                                    setProcessing(true)

                                    setCheckingSimilarity(true)

                                    let {  count: similarData, error: similarError } : any = await supabase
                                        .from('qna')
                                        .select('*', { count: 'estimated', head: true})
                                        .eq('deleted', false)
                                        .ilike('question', '%'+ values.question +'%')

                                    setCheckingSimilarity(false)

                                    if(similarData === 0){

                                        let { data: essayData, error: essayError } = await supabase.from('qna').insert({
                                            question: values.question,
                                            answer: values.answer,
                                            discipline: values.discipline,
                                            posted_by: user?.id
                                        })
                                        .select('uuid').single()

                                        if(essayError) throw essayError

                                        if(essayData){

                                            window.scrollTo({ top: 0, behavior: 'smooth'})

                                            setSuccess(true)

                                            resetForm()

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
                                    <label className="font-medium" htmlFor="discipline">Discipline</label>
                                    <div>
                                        <Field name="discipline" as="select" className="bg-white border border-gray-300 rounded px-3 py-2 w-full focus:outline-1 focus:outline-amber-600">
                                            <option></option>
                                            { disciplines?.map((discipline: { uuid: any; name: string; }) : any => (
                                                <option key={discipline?.uuid} value={discipline?.uuid} className="text-black">{ discipline?.name }</option>
                                            ))}
                                        </Field>
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="discipline" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="question" className="font-medium">Question</label>
                                    <div>
                                        <Field name="question" as="input" type="text" className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-1 focus:outline-amber-600" />
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="question" />
                                    </div>
                                </div>
                        
                                <div className="mb-3">
                                    <label htmlFor="answer" className="font-medium">Answer</label>
                                    <div>
                                        <Field name="answer" component={QnATextArea} className="border border-gray-300 rounded px-3 py-1.5 w-full focus:outline-1 focus:outline-amber-600" />
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="answer" />
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