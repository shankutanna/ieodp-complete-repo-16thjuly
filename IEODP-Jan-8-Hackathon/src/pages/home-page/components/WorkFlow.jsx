import React from 'react'
import {motion} from 'framer-motion'
import { fadeUp, stagger } from '../../../utils/motionUtils'

const WorkFlow = () => {
  return (
      <div>
          <motion.section initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}  className=" mx-auto p-4">
              <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-4 text-center">How It Works</motion.h2>
              <motion.ul initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger} className="steps steps-vertical w-full lg:steps-horizontal">
                  <motion.li variants={fadeUp} className="step step-primary">Operations</motion.li>
                  <motion.li variants={fadeUp}  className="step step-primary">Leadership</motion.li>
                  <motion.li variants={fadeUp} className="step step-primary">Management</motion.li>
                  <motion.li variants={fadeUp} className="step step-primary">Auditor</motion.li>
              </motion.ul>
          </motion.section>
    </div>
  )
}

export default WorkFlow