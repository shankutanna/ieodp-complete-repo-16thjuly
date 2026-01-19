import {
  LayoutGrid,
  ClipboardCheck,
  NotebookTabs,
  TrendingUp,
  ShieldCheck,
  FileSearch,
  GitBranch,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLES } from "../utils/roles";
import { containerVariants, itemVariants } from "../utils/motionUtils";




const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);

  const menuConfig = {
    [ROLES.OPERATIONS]: [
      { title: "Dashboard", icon: <LayoutGrid />, path: "/operations/dashboard" },
      { title: "Requests", icon: <NotebookTabs />, path: "/operations/requests" },
      {
        title: "Workflow Process",
        icon: <GitBranch />,
        path: "/workflow-process"
      }

    ],
    [ROLES.ADMIN]: [
      { title: "Dashboard", icon: <LayoutGrid />, path: "/admin/dashboard" },
      { title: "Users", icon: <Users />, path: "/admin/users" },
    ],


    [ROLES.LEADERSHIP]: [
      { title: "Dashboard", icon: <LayoutGrid />, path: "/leadership/dashboard" },
      { title: "Reviews", icon: <ClipboardCheck />, path: "/leadership/reviews" },
      { title: "AI Insights", icon: <TrendingUp />, path: "/leadership/insights" },
      {
        title: "Workflow Process",
        icon: <GitBranch />,
        path: "/workflow-process"
      }

    ],

    [ROLES.MANAGEMENT]: [
      { title: "Dashboard", icon: <LayoutGrid />, path: "/management/dashboard" },
      { title: "Actions", icon: <ClipboardCheck />, path: "/management/actions" },
      // { title: "Approvals", icon: <ShieldCheck />, path: "/management/approvals" },
      {
        title: "Workflow Process",
        icon: <GitBranch />,
        path: "/workflow-process"
      }

    ],

    [ROLES.AUDITORS]: [
      { title: "Dashboard", icon: <LayoutGrid />, path: "/auditors/dashboard" },
      { title: "Audit Logs", icon: <FileSearch />, path: "/auditors/logs" },
      { title: "Decisions", icon: <ShieldCheck />, path: "/auditors/decisions" },
      {
        title: "Workflow Process",
        icon: <GitBranch />,
        path: "/workflow-process"
      }

    ],
  };

  const menuItems = menuConfig[role] || [];

  const handleMenuClick = (path) => {
    navigate(path);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // 🔥 SMART ACTIVE PATH RESOLUTION (BUG FIX)
  const getActivePath = () => {
    const currentPath = location.pathname;

    // 1. Direct match (normal pages)
    const directMatch = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    if (directMatch) return directMatch.path;

    // 2. Ticket details page mapping
    if (currentPath.startsWith("/tickets")) {
      if (role === ROLES.OPERATIONS) return "/operations/requests";
      if (role === ROLES.LEADERSHIP) return "/leadership/reviews";
      if (role === ROLES.MANAGEMENT) return "/management/actions";
      if (role === ROLES.AUDITORS) return "/auditors/decisions";
    }

    return null;
  };

  const activePath = getActivePath();

  return (
    <div
      className={`h-full bg-base-200 shadow-lg p-3 rounded-lg transition-all duration-300 ${isSidebarOpen ? "block" : "hidden md:block"
        }`}
    >
      <motion.div
        className="flex flex-col gap-4 p-3 rounded-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="mb-4 text-xl font-bold" variants={itemVariants}>
          {role} Panel
        </motion.h2>

        {menuItems.map((item, i) => {
          const active = activePath === item.path;

          return (
            <motion.button
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleMenuClick(item.path)}
              className={`p-2 rounded text-left transition duration-300 
                ${active
                  ? "bg-primary text-primary-content shadow-md"
                  : "bg-transparent hover:bg-primary/20"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>

                {/* Active Badge Indicator */}
                <span className={`${active ? "badge badge-xs bg-white" : ""}`} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Sidebar;
