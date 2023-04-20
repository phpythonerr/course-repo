import PageHeader from "@/components/widgets.tsx/page-header";
import Head from "next/head";
import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";

export default function NewDiscipline(){

    return (<>
        <Head>
            <title>New Discipline</title>
        </Head>
        <PageHeader title="New Discipline"/>
    </>)

}