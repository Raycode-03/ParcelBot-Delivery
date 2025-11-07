import React from 'react'

function MapView() {
  return (
    <>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.593!2d6.3383!3d4.951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1042950!2sYenagoa!5e0!3m2!1sen!2sng!4v000000000"
          allowFullScreen
        />
    </>
  )
}

export default MapView