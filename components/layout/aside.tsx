import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineLogout } from "react-icons/ai";
import { VscArchive, VscBold, VscDashboard, VscFolderLibrary, VscWholeWord } from "react-icons/vsc";
import { MdOutlineQuestionAnswer } from "react-icons/md"

export default function Aside(){

    const links = [
        {icon: <VscDashboard/>, href: '/', label: 'Dashboard'},
        {icon: <VscArchive/>, href: '/essays', label: 'Essays'},
        // {icon: <VscArchive/>, href: '/disciplines', label: 'Disciplines'},
        {icon: <MdOutlineQuestionAnswer/>, href: '/qna', label: 'Question & Answer'},
        // {icon: <VscFolderLibrary/>, href: '/disciplines', label: 'Disciplines'},
        // {icon: <VscWholeWord/>, href: '/services', label: 'Services'},
        // {icon: <VscBold/>, href: '/blog', label: 'Blog'},
    ]

    const router = useRouter();

    const supabase = useSupabaseClient()

    const handleSignOut = async() => {

        await supabase.auth.signOut()

        router.reload()

    }

    return (<>
        <aside className="h-full w-0 md:w-60 border-r bg-white">
            <ul className="w-full text-base text-gray-800">
                { links.map((link): any => (
                    <li key={link.href} className="block px-2 py-1.5 hover:bg-gray-100">
                        <Link href={link.href} className="flex items-center">
                            <span>{ link.icon }</span>
                            <span className="px-1">{ link.label }</span>
                        </Link>
                    </li>
                ))}
                <li className="block px-2 py-1.5 hover:bg-gray-100">
                    <button type="button" onClick={handleSignOut} className="flex items-center w-full">
                        <span>
                            <AiOutlineLogout/>
                        </span>
                        <span className="px-1">Logout</span>
                    </button>
                </li>
            </ul>
        </aside>
    </>)

}