import React from "react";
import { motion } from "framer-motion";
import { FaPython, FaDatabase, FaReact, FaBrain, FaChartBar, FaCode } from "react-icons/fa";
import { SiScikitlearn, SiTensorflow } from "react-icons/si";

const icons = [
  { icon: FaPython, top: "18%", left: "8%", size: "40px", delay: 0 },
  { icon: FaBrain, top: "28%", left: "85%", size: "48px", delay: 2 },
  { icon: FaDatabase, top: "48%", left: "5%", size: "36px", delay: 1 },
  { icon: SiScikitlearn, top: "60%", left: "90%", size: "42px", delay: 3 },
  { icon: FaChartBar, top: "75%", left: "12%", size: "44px", delay: 4 },
  { icon: SiTensorflow, top: "85%", left: "80%", size: "38px", delay: 1.5 },
  { icon: FaCode, top: "38%", left: "15%", size: "32px", delay: 2.5 },
  { icon: FaReact, top: "70%", left: "85%", size: "46px", delay: 0.5 },
];

const BackgroundIcons = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: 0
    }}>
      {icons.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              fontSize: item.size,
              color: "#6366f1", // Slate-Indigo theme primary color
              opacity: 0.04, // Subtle background watermark opacity
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 18 + idx * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <IconComponent />
          </motion.div>
        );
      })}
    </div>
  );
};

export default BackgroundIcons;
