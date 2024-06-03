import React from 'react'
import photo from '../../assets/Untitled-1.png'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'

const HeroScetion = () => {
    const navigate = useNavigate()

    return (
        < div className="relative isolate px-6 pt-14 lg:px-8" >
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00529B] to-[#009D57] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                ></div>
            </div>
            <div className="mx-auto max-w-2xl pt-32 sm:pt-48 lg:pt-56">

                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        OUR MISSION IN EXOP
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Enable everyone to reveal their full potential and acquire a profession to aspire to a better future.
                    </p>
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center mt-12">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">

                            <div variant={"secondary"} onClick={() => navigate('/app')} className="font-semibold text-green-600 text-lg bg-transparent cursor-pointer">
                                <span className="absolute inset-0" aria-hidden="true"></span>
                                Get Started
                                <span aria-hidden="true">&rarr;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center max-w-full">
                <img
                    src={photo}
                    alt="The photo"
                    className="w-full h-auto lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
                />
            </div>

            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#00529B] to-[#009D57] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                ></div>
            </div>
        </div >

    )
}

export default HeroScetion