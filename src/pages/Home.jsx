import Illustration from '../resources/illustration.svg'
import '../style/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faMoon } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from 'react';
import checkUrl from '../utils/url.mjs';
import { baseUrl, endpoint } from '../config/config.mjs';

const Home = () => {
    const [destination, setDestination] = useState('')
    const [alias, setAlias] = useState('')
    const [valid, setValid] = useState(false)
    const [success, setSuccess] = useState(null)
    const [response, setResponse] = useState(null)

    const createUrl = (event) => {
        fetch(`${endpoint}`, {
            body: JSON.stringify({
                destination: destination,
                alias: alias,
            }),
            method: "POST"
        }).then(response => response.json()).then(data => {
            if (data['code'] === 200) {
                setResponse(data)
                setSuccess(true)
            } else {
                setResponse(data)
                setSuccess(false)
            }
        })

        event.preventDefault()
    }

    const destinationOnChange = (event) => {
        setDestination(event.target.value)
    }

    const aliasOnChange = (event) => {
        setAlias(event.target.value)
    }

    const changeThemeMode = () => {
        document.body.classList.toggle('dark-mode');
        document.getElementById('navbar').classList.toggle('navbar-dark-mode');
        document.getElementById('bottom-nav').classList.toggle('bottom-nav-dark-mode');
        document.getElementById('content').classList.toggle('content-dark-mode');
        document.getElementById('moto').classList.toggle('moto-dark-mode');
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${baseUrl}/${response['data']['alias']}`)
    }

    const closeAlert = () => {
        document.getElementById('alert').remove()
    }

    useEffect(() => {
        if (destination.length > 0 && alias.length > 2 && checkUrl(destination)) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [destination, alias])

    return (
        <>
            <section id="navbar" className="drop-shadow-sm bg-white">
                <div className="container mx-auto py-4 flex flex-row content-center place-items-center justify-between">
                    <a href="/">
                        <p className="text-2xl font-bold cursor-pointer hover:text-green-300">Seior Shortener.</p>
                    </a>
                    <div className="flex gap-5 place-items-center">
                        <a href="https://github.com/radenrishwan/shortener-web">
                            <p className="font-semibold cursor-pointer font-lg hover:text-green-300">Github</p>
                        </a>
                        <FontAwesomeIcon icon={faMoon}
                            className="font-semibold cursor-pointer font-lg hover:text-green-300"
                            onClick={changeThemeMode} />
                    </div>
                </div>
            </section>
            {response !== null ? <>
                <div id='alert'
                    className="container mx-auto w-full mt-5 h-[2rem] bg-green-300 rounded-lg flex justify-between p-5 border-2 items-center alert-dark-mode">
                    <h1 className="text-md font-medium">{response['message']}</h1>
                    <button className="mr-2 text-md" id="error-button" onClick={closeAlert}>✖️</button>
                </div>
            </> : <></>}
            <section id="content" className="container mx-auto px-4 my-4 mt-20">
                <div className="flex flex-row">
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="w-[450px] p-10 bg-green-300 rounded-lg border-2">
                                <p className="text-xl font-bold">Create new link</p>
                                <form onSubmit={createUrl}>
                                    <input type="text" name="destination" id="destination"
                                        className="border-none outline-none mt-5 rounded-lg h-10 w-full p-5"
                                        placeholder="Enter destination link" onChange={destinationOnChange} />
                                    {destination === "" || checkUrl(destination) ? <></> :
                                        <>
                                            <div id="destination-input-alert"
                                                className="px-4 py-2 text-red-500 font-medium">⚠️ Please input correct
                                                url
                                            </div>
                                        </>}
                                    <input type="text" name="alias" id="alias"
                                        className="border-none outline-none mt-5 rounded-lg h-10 w-full p-5"
                                        placeholder="Enter Alias" onChange={aliasOnChange} />
                                    {alias === "" || !(alias.length < 3) ? <></> :
                                        <>
                                            <div id="destination-input-alert"
                                                className="px-4 py-2 text-red-500 font-medium">⚠️ Alias must be at
                                                least 3 characters
                                            </div>
                                        </>}
                                    <div className='flex flex-row justify-end mt-5'>
                                        {valid ? <>
                                            <input type="submit"
                                                className="rounded-lg bg-violet-400 px-4 py-2 cursor-pointer"
                                                value="Create" />
                                        </> : <>
                                            <input type="submit"
                                                className="rounded-lg bg-violet-200 px-4 py-2 cursor-pointer"
                                                value="Create" disabled />
                                        </>}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {success ? <>
                            <div className="flex flex-ro mt-5">
                                <div className="w-[450px] p-10 bg-green-300 rounded-lg border-2">
                                    <p className="text-xl font-bold">Result Here</p>
                                    <div id="result"
                                        className="mt-5 flex flex-row justify-between place-items-start content-center">
                                        <input type="text" name="output" id="output" maxLength="31"
                                            className="border-none outline-none rounded-lg h-10 w-full p-5"
                                            placeholder="" disabled
                                            value={`${baseUrl}/${response['data']['alias']}`} />
                                        <button className="px-3 text-2xl" id="copy-url" onClick={copyToClipboard}>📋</button>
                                    </div>
                                </div>
                            </div>
                        </> : <></>}
                    </div>
                    <div id='moto' className="ml-5 mt-10 flex flex-col justify-between content-start">
                        <div className="ml-[4.5rem]">
                            <h1 className='text-2xl font-semibold'>Hi, Visitors 👋</h1>
                            <h1 className="text-4xl font-semibold">Make your url look better</h1>
                            <p>Feel free to use and shared to your friend</p>

                            <img src={Illustration} alt="illustration" className='my-10' />
                        </div>
                    </div>
                </div>
            </section>
            <section id="bottom-nav"
                className="bg-green-300 rounded-lg border-2 m-5 flex flex-row justify-center absolute bottom-0 w-[92vw] ml-auto mr-auto left-0 right-0">
                <div
                    className="h-[80px] container mx-px px-4 my-4 flex flex-col justify-center content-center place-items-center gap-4">
                    <h1 className="text-lg font-semibold">Copyright © 2022 Raden Mohamad Rishwan.</h1>
                    <ul className="flex justify-center gap-5">
                        <li>
                            <a href="https://facebook.com/raden.muhamad.391">
                                <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/radenrishwan">
                                <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/radenrishwan">
                                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/raden-mohamad-rishwan-1b1476213/">
                                <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )
}

export default Home