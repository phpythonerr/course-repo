import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import Base from '@/components/layout/base'

export default function App({ Component, pageProps } : any) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  const renderWithLayout =
    Component.getLayout ||
    function (page : any) {
      return (
        <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
        >
              <Base>{page}</Base>
        </SessionContextProvider>
      );
    };

    return renderWithLayout(
    <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
    >
        <Component {...pageProps} />
    </SessionContextProvider>);
}