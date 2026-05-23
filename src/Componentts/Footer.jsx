import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const linkGroups = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Contact"],
    },
    {
      title: "Help",
      links: ["Payments", "Shipping", "Returns", "FAQ"],
    },
  ];

  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:col-span-2 lg:col-span-1"
          >
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-extrabold text-brand-400 tracking-tight">
                ECOMET
              </h2>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              Premium shopping experience curated for the modern world. Quality
              meets affordability.
            </p>
          </motion.div>

          {linkGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
                {group.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {group.links.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:text-brand-400 transition-colors duration-200"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
              Newsletter
            </h3>
            <p className="text-sm mb-4 text-slate-500">
              Get deals and updates in your inbox.
            </p>
            <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10 focus-within:border-brand-400/50 transition-colors">
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email for newsletter"
                className="bg-transparent px-4 py-2.5 outline-none text-sm w-full text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                className="bg-brand-500 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-400 transition-colors flex-shrink-0"
              >
                Join
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500 tracking-wide">
        © {new Date().getFullYear()} Ecomet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
