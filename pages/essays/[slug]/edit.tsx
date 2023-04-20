import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextArea } from "@/components/inputs/textarea";
import { Key, useEffect, useState } from "react";
import Loading from "@/components/loading";
import Container from "@/components/layout/container";
import { Success, Warning } from '@/components/alert'
import { useRouter } from "next/router";
import { SelectCourse } from "@/components/inputs/select-course";
import { useSupabaseClient } from "@supabase/auth-helpers-react";


export default function NewEssay(){

    const supabase = useSupabaseClient()

    const router = useRouter()

    const slug = router.query.slug

    const [courses, setCourses] : any = useState(null)

    const [disciplines, setDisciplines] : any = useState(null)

    const [essay, setEssay] : any = useState({})

    const [success, setSuccess] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        async function loadData(){
        
            try{

                setLoading(true)

                let { data: disciplineData, error: disciplineError } : any = await supabase.from('discipline').select('name, uuid, course ( name, uuid )').order('name')

                if(disciplineData) setDisciplines(disciplineData)

                let { data: essayData, error: essayError } : any = await supabase.from('essay').select('*').eq('slug', slug).single()

                if(essayData){

                    setEssay(essayData)

                    let { data: coursesData, error: coursesError } : any = await supabase.from('course').select('name, uuid, discipline ( name )')

                    if(coursesData) setCourses(coursesData)

                }
                else{

                    return {

                        notFound: true,

                    };

                }

            }
            catch(err){

                throw err

            }
            finally{

                setLoading(false)

            }

        }

        loadData()

    }, [slug])

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
            <title>{ loading ? 'Loading...' : `Edit Essay - ${essay?.title }`}</title>
        </Head>
        <PageHeader title={loading ? 'Loading...' : `Edit Essay - ${essay?.title }`}/>
        <div className="p-3">
            { loading ? (<Loading/>) : (
            <Container bg="bg-gray-50">
                <Warning message="Text Editor may take a few seconds to load. Please wait until the editor on the 'Essay' field loads completely."/>
                <Warning message="You may receive a warning on the text editor that says 'The API key you entered is invalid.' It is safe to ignore the warning. Click the 'X' button to close the warning. If problem persists contact support."/>
                <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        { success && <Success message={`${essay?.title } Essay Edited Successfully`}/>}
                        <Formik
                            initialValues={{ 
                                course: essay?.course, 
                                title: essay?.title, 
                                essay: essay?.body
                            }}
                            validationSchema={Yup.object({
                                course: Yup.string().required('Required'),
                                title: Yup.string().required('Required'),
                                essay: Yup.string().required('Required'),
                            })}
                            onSubmit={async(values, { setSubmitting, resetForm }) => {

                                let { data: essayData, error: essayError } = await supabase.from('essay')
                                .update({
                                    title: values.title,
                                    body: values.essay,
                                    course: values.course
                                })
                                .eq('slug', essay?.slug)
                                .select('body')
                                .single()

                                if(essayData){

                                    setSuccess(true)

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
                                    <Field name="essay">
                                        {({field, form, meta,} : { field: any; form: any; meta: any })  => (
                                        <div>
                                            <TextArea field={field} form={form} />
                                        </div>
                                        )}
                                    </Field>
                                    </div>
                                    <div className="text-xs text-red-600 block py-1">
                                        <ErrorMessage name="essay" />
                                    </div>
                                </div>
                        
                                <div className="mb-3">
                                    <button type="submit" className="bg-amber-600 text-white py-1.5 px-3 rounded">Edit</button>
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