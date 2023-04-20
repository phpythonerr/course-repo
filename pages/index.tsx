import PageHeader from "@/components/widgets.tsx/page-header";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Dashboard(){

  const user = useUser()

  const supabase = useSupabaseClient()

  const today = new Date().toISOString().substring(0, 10);

  const [postedToday, setPostedToday] = useState<number|null>(0)

  useEffect(() => {

    const getPostedToday = async() => {

        let { count: postedTodayCount, error: postedTodayError } = await supabase
        .from('essay')
        .select('*', { count: 'exact', head: true})
        .eq('posted_by', user?.id)
        .eq('deleted', false)
        .eq('created_at::DATE', today)
        

        if(postedTodayError) throw postedTodayError

        setPostedToday(postedTodayCount)

    }

    if(user?.id) getPostedToday()

    
  }, [user?.id])


  return (<>
    <Head>
        <title>Dashboard</title>
    </Head>
    <PageHeader title="Dashboard"/>
    <div className="p-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3 md:col-span-1">
            <div className="bg-white p-2 rounded border border-gray-200">
                { postedToday }
            </div>
          </div>
        </div>
    </div>
  </>)

}