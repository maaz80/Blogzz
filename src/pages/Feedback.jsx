import React, { useEffect } from 'react'
import appwriteService from '../appwrite/config'
function Feedback() {
    useEffect(()=>{
        appwriteService.getFeedback().then((feedback)=>{
            if(feedback){
                console.log(feedback);
                
            }
        })
    })
  return (
    <div>
      
    </div>
  )
}

export default Feedback
