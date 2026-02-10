import {useNavigate } from 'react-router-dom'
export const ButtonRedirect=({link,buttonName,style})=>{
    const navigate = useNavigate()

    const handleClick= ()=>{
        navigate(link)
    }
    return (
        <button onClick={handleClick} className={style}>{buttonName}</button>
    )
}