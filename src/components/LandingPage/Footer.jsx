import React from 'react'
import exop from '../../assets/EXOP.png'



const Footer = () => {
    return (


        <footer className="bg-white rounded-lg shadow m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={exop} className="h-8" alt="Flowbite Logo" />
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
                        <li>
                            <a href="#whyExop" className="hover:underline me-4 md:me-6">Why Exop</a>
                        </li>
                        <li>
                            <a href="#howItWorks" className="hover:underline me-4 md:me-6">How it works ?</a>
                        </li>
                        <li>
                            <a href="#features" className="hover:underline me-4 md:me-6">Features</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center ">© 2024 <a href="https://flowbite.com/" className="hover:underline">EXOP™</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}

export default Footer