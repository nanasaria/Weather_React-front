import React from 'react'
import { ColorRing } from 'react-loader-spinner'

function Loading() {
  return (
    <div>
      <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#5EB5B5', '#FFFFFF', '#086B6B', '#000000', '#03B5B5']}
         />
    </div>
  )
}

export default Loading
