import { ClipboardPlus, LayoutDashboard, Users, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../../utils/motionUtils";



const KeyCapabilities = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="p-2 m-2"
    >
      <motion.h1
        variants={fadeUp}
        className="text-2xl font-semibold text-center mb-6"
      >
        Core Capabilities
      </motion.h1>

      <div className="grid gap-3 lg:grid-cols-4 grid-cols-2 max-sm:grid-cols-1">
        {/* CARD 1 */}
        <motion.div variants={fadeUp} className="card bg-base-200 p-2 shadow hover:shadow-lg transition">
          <p className="flex justify-evenly p-2">
            <Workflow size={34} />
            <span className="card-title">Workflow Management</span>
          </p>
          <div className="card-body">
            <span>Multi-step workflows</span>
            <span>Status-driven UI behavior</span>
            <span>Reverify loops</span>
          </div>
        </motion.div>

        {/* CARD 2 */}
        <motion.div variants={fadeUp} className="card bg-base-200 p-2 shadow hover:shadow-lg transition">
          <p className="flex justify-evenly p-2">
            <Users size={34} />
            <span className="card-title">Role-Based Access</span>
          </p>
          <div className="card-body">
            <span>Operations, Leadership, Management, Auditors, Admin</span>
            <span>Permission-driven actions</span>
            <span>Secure route protection</span>
          </div>
        </motion.div>

        {/* CARD 3 */}
        <motion.div variants={fadeUp} className="card bg-base-200 p-2 shadow hover:shadow-lg transition">
          <p className="flex justify-evenly p-2">
            <ClipboardPlus size={34} />
            <span className="card-title">Audit & Compliance</span>
          </p>
          <div className="card-body">
            <span>Full activity timeline</span>
            <span>Append-only history</span>
            <span>Decision traceability</span>
          </div>
        </motion.div>

        {/* CARD 4 */}
        <motion.div variants={fadeUp} className="card bg-base-200 p-2 shadow hover:shadow-lg transition">
          <p className="flex justify-evenly p-2">
            <LayoutDashboard size={34} />
            <span className="card-title">Enterprise Dashboards</span>
          </p>
          <div className="card-body">
            <span>KPI widgets</span>
            <span>Charts & analytics</span>
            <span>Config-driven rendering</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default KeyCapabilities;
