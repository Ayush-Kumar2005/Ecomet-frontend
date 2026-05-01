import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-gray-400 mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-emerald-400 tracking-tighter">ECOMET</h2>
          <p className="text-sm leading-relaxed">
            Premium shopping experience curated for the modern world. Quality meets affordability.
          </p>
        </div>

        {["Company", "Help"].map((title) => (
          <div key={title}>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{title}</h3>
            <ul className="space-y-4 text-sm">
              {title === "Company" 
                ? ["About Us", "Careers", "Blog", "Contact"].map(item => <li key={item} className="hover:text-emerald-400 transition cursor-pointer">{item}</li>)
                : ["Payments", "Shipping", "Returns", "FAQ"].map(item => <li key={item} className="hover:text-emerald-400 transition cursor-pointer">{item}</li>)
              }
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Newsletter</h3>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-emerald-400/50">
            <input type="email" placeholder="Email" className="bg-transparent px-3 py-2 outline-none text-sm w-full" />
            <button className="bg-emerald-400 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-300 transition">JOIN</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-8 text-center text-[10px] uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ecomet Infrastructure. All Rights Reserved.
      </div>
    </footer>
  );
};
export default Footer;