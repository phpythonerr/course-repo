import Container from "@/components/layout/container";
import Loading from "@/components/loading";
import PageHeader from "@/components/widgets.tsx/page-header";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import * as Yup from 'yup';
import { Key, useEffect, useState } from "react";
import { SelectCourse } from "@/components/inputs/select-course";

export default function Disciplines(){

    const supabase = useSupabaseClient()

    const user = useUser()

    const [courses, setCourses] = useState<string[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const [processing, setProcessing] = useState<boolean>(false)

    const [success, setSuccess] = useState<boolean | null>(null)

    const [error, setError] = useState<boolean | null>(null)

    useEffect(() => {

        const getCourses = async() => {

            try{

                setLoading(true)

                let { data, error } : any = await supabase.from('discipline').select('name, uuid, course ( name, uuid )').order('name')

                if (error) throw error

                if(data) setCourses(data)

            }
            catch (err){

                throw err

            }
            finally{

                setLoading(false)

            }

        }

        if(user?.id) getCourses()
      
    }, [user?.id])

    let optgroups: { label: string; options: any[]; }[] = []

    { courses.map( (course) : any => {
        optgroups.push(
            {
                label: course?.name,
                value: course?.uuid
            }
        )
    })}

    return (<>
        <Head>
            <title>Courses</title>
        </Head>
        <PageHeader title="Courses"/>
        <div className="p-3">
        { loading ? (<Loading/>) : (
            <Container>
                <div>
                    <div className="py-5 border-b mb-3">
                        <h3 className="font-medium">Add Course</h3>
                        <div className="py-3">
                        <Formik
                            initialValues={{ discipline: '', name: '' }}
                            validationSchema={Yup.object({
                                discipline: Yup.string().required('Required'),
                                name: Yup.string().required('Required'),
                            })}
                            
                            onSubmit={async(values, { setSubmitting, resetForm }) => {


                                try{

                                    setProcessing(true)

                                    let { data, error } = await supabase.from('course').insert({
                                        name: values?.name,
                                        discipline: values?.discipline
                                    })
                                    .select('name')
                                    .single()

                                    console.log(error)

                                    console.log(data)


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
                                    <div className="flex items-center gap-3">
                                        <div className="w-64">
                                            <p>Discipline</p>
                                            <Field 
                                                name="course" 
                                                isMulti={false}
                                                component={SelectCourse} 
                                                className="bg-white z-30 rounded w-full"
                                                options={optgroups}
                                            />
                                        </div>
                                        <div className="w-64">
                                            <p>Course</p>
                                            <Field 
                                                name="name" 
                                                className="bg-white py-1 px-3 border z-30 rounded w-full"
                                            />
                                        </div>
                                        <div>
                                            <button className="py-1 px-3 text-white bg-blue-600 rounded">Add</button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                    { courses.map((course) : any => (
                        <p key={course?.uuid} className="py-1.5 text-sm">{ course?.name }</p>
                    ))}
                </div>
            </Container>
        )}
        </div>
    </>)

}