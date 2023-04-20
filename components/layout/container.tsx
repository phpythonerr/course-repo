export default function Container( { children, bg} : any ){

    return (<div className={`container border rounded p-5 ${ bg ? bg : 'bg-white'}`}>{ children }</div>)

}