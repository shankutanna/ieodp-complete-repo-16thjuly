import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../auth/authSlice'
import { Bell, Moon, Sun } from 'lucide-react'
import MotionDiv from '../utils/MotionDiv'

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <div className="fixed  inset-x-0 top-0 z-10  backdrop-blur-md border-b border-primary/20  shadow-lg">
            <MotionDiv delay={0.1}>
                <div className="navbar bg-base-100 shadow-sm md:px-10 max-sm:px-2 ">
                    <div className='flex-1'>
                        <Link to='/'  className='text-xl font-semibold'>IEODP</Link>
                    </div>
                    <div className='max-sm:hidden '>
                        <div>
                            <input type="text" placeholder="Search" className="input input-bordered   md:w-auto" />
                        </div>
                    </div>
                    <div className=' md:navbar-end '>
                        <div className='flex justify-between items-center gap-4'>
                            <div>
                                <label className="swap swap-rotate mt-1">
                                    {/* this hidden checkbox controls the state */}
                                    <input
                                        type="checkbox"
                                        className="theme-controller"
                                        value="dark"
                                    />

                                    {/* sun icon */}
                                    <Sun className="swap-on h-8 w-8 fill-current" />

                                    {/* moon icon */}

                                    <Moon className="swap-off h-8 w-8 fill-current" />
                                </label>
                            </div>
                            <div className="dropdown dropdown-end  block">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle"
                                >
                                    <div className="indicator">
                                        <Bell />
                                        <span className="badge badge-sm indicator-item">0</span>
                                    </div>
                                </div>
                                <div
                                    tabIndex={0}
                                    className="card card-compact dropdown-content bg-base-100 z-1 mt-3 md:w-62 shadow"
                                >
                                    <div className="card-body">
                                        <span className="text-sm label">
                                            There a no notifications available{" "}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className=" ">
                                    <div

                                        className="flex border-l md:pl-2 border-gray-300 justify-between items-center md:gap-3 max-sm:gap-1 "
                                    >
                                        <figure className="w-12 max-sm:w-10 cursor-pointer">
                                            <img
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                className="rounded-full p-1"
                                            />
                                        </figure>
                                        <div>
                                            <h1 className=" font-semibold max-sm:text-sm">
                                                User Name
                                            </h1>
                                            <span className="label max-sm:text-xs">Role</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                {/* <h1>UserName</h1> */}
                                {!user &&
                                    <Link to='/login' className=' btn btn-primary'>login</Link>
                                }
                                {/* <Link to='/signup' className=' btn btn-secondary'>Signup</Link> */}
                                {
                                    user &&
                                    <div onClick={handleLogout} className=' btn btn-error btn-outline'>Logout</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </MotionDiv>
        </div>
    )
}

export default Navbar