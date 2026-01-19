import React from 'react'

const SignUp = () => {
  return (
      <div className='flex justify-center items-center mx-auto h-screen w-screen'>
          <div className='card max-w-4xl'>
              <div className='card-body max-w-3xl'>
                  <form action=" " className='border p-2 rounded-md'>
                      <fieldset className=' fieldset shadow'>
                          <label htmlFor="firstName">FirstName</label>
                          <input type='text' name='firstName' className='input ' id='firstName' />
                          <label htmlFor="lastName">LastName</label>
                          <input type='text' name='lastName' className='input ' id='lastName' />
                          <label htmlFor="email">Email</label>
                          <input type='text' name='email' className='input ' id='email' />
                          <label htmlFor="password">Password</label>
                          <input type='text' name='password' id='password' className='input' />
                          <button type='button' className='btn btn-primary'>SignUp</button>
                      </fieldset>
                  </form>
              </div>
          </div>
      </div>
  )
}

export default SignUp