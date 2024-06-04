import React from 'react'
import exop from '../../assets/EXOP.png'

const Navbar = () => {
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-12	 w-auto" src={exop} alt="" />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#whyExop" className="text-sm font-semibold leading-6 text-gray-900">Why Exop</a>
                    <a href="#howItWorks" className="text-sm font-semibold leading-6 text-gray-900">How it works ?</a>
                    <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">Features</a>
                </div>
            </nav>

     
        </header>
    )
}

export default Navbar