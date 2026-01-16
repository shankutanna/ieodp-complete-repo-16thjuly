import React from 'react'
import HeroSection from './components/HeroSection'
import KeyCapabilities from './components/KeyCapabilities'
import WorkFlow from './components/WorkFlow'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className='mt-0'>
      <HeroSection />
      <KeyCapabilities />
      <WorkFlow />
      <section className="text-center py-16 bg-base-200">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </section>

    </div>
  )
}

export default HomePage