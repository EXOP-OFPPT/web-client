import React from 'react'
import photo from '../../assets/03.png'

const SectionTwo = () => {
  return (
    <section className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl py-16 sm:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Enhanced Performance Tracking
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            The KPI are the key to enhances the school by enabling the creation, tracking, and management those key performance indicators, ensuring alignment with institutional goals and facilitating continuous performance improvement.
          </p>

        </div>
        <div className="flex-shrink-0">
          <img
            src={photo}
            alt="Description of the photo"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

export default SectionTwo