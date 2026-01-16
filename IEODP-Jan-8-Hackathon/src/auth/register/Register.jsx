import React from 'react'
import MotionDiv from '../../utils/MotionDiv'
import RegisterForm from './components/RegisterForm'

const Register = () => {
  return (
      <MotionDiv delay={0.3}>
          <div className="min-h-screen flex items-center justify-center bg-base-200">
              <div className="">
                  <div className="hero card bg-gradient-to-br from-lime-500 to-lime-900">
                      <div className="hero-content card-body flex-col lg:flex-row-reverse font-bold">
                          <div>
                              <RegisterForm />
                          </div>

                          <div className="text-center flex flex-col gap-4 lg:text-left">
                              <h1 className="text-5xl font-bold">Register now!</h1>
                              <h1 className="font-semibold ">Intelligent Enterprise Operations & Decision Platform</h1>
                              <p className=" max-w-md text-sm sm:text-base leading-relaxed">
                                  A unified platform to manage workflows, ensure compliance, and drive data-backed decisions across your organization.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </MotionDiv>
  )
}

export default Register