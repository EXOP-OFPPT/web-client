import React from 'react'
import photo from '../../assets/Untitled-2.png'

const SectionOne = () => {
  return (
    <section className="relative isolate px-6 pt-14 lg:px-8">

      <div className="mx-auto max-w-6xl py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex-shrink-0">
          <img
            src={photo}
            alt="Description of the photo"
            className="w-full "
          />
        </div>

        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why we createad EXOP
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            The "Exop" project was initiated with the aim of providing an efficient management platform for the institution, enabling performance tracking, task management, and internal communication.
          </p>
          
        </div>

      </div>
    </section>
  )
}

export default SectionOne