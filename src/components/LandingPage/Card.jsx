import React from 'react'

const Card = ({ title, text, icon, iconBg }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
            <div className={`p-3 ${iconBg} text-white rounded-full`}>
                {icon}
            </div>
            <h3 className="ml-4 text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-700">{text}</p>
    </div>
  )
}

export default Card