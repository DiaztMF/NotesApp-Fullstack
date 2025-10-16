import { useEffect } from 'react';
import { NavBar } from '@/components/navbar';
import { useState } from 'react';
import emailjs from "emailjs-com";
import { toast } from 'sonner';

export const ContactUsPage = () => {
  useEffect(() => {
      document.title = "About | Notesapp"
    }, [])
    
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await emailjs.send(
        "service_0aev6ao",
        "template_k0x0w2v",
        formData,
        "8PuAH8Q7jc7nMe0CX"
      );
      toast.success('Message sent successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        message: ''
      });
    } catch (error) {
      toast.error("Gagal mengirimkan email:", error.text)
    } finally {
      setIsLoading(false)
    }
  };

  const CheckIcon = () => (
    <svg width="25" height="25" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.3333 15.5417L13.4583 18.6667L18.6667 11.375M27 14.5C27 16.1415 26.6767 17.767 26.0485 19.2835C25.4203 20.8001 24.4996 22.1781 23.3388 23.3388C22.1781 24.4996 20.8001 25.4203 19.2835 26.0485C17.767 26.6767 16.1415 27 14.5 27C12.8585 27 11.233 26.6767 9.71646 26.0485C8.19989 25.4203 6.8219 24.4996 5.66116 23.3388C4.50043 22.1781 3.57969 20.8001 2.95151 19.2835C2.32332 17.767 2 16.1415 2 14.5C2 11.1848 3.31696 8.00537 5.66116 5.66117C8.00537 3.31696 11.1848 2 14.5 2C17.8152 2 20.9946 3.31696 23.3388 5.66117C25.683 8.00537 27 11.1848 27 14.5Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const advantages = [
    'Fast & Secure Saving',
    'Edit & Manage Easily',
    'Responsive for All Devices',
    'Dark Mode Experience',
    'Export & Import Freely',
    'Restore old Memories'
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/diazt-muhammad-firmansyah-39947a365/',
      color: 'bg-[#0274b3]',
      icon: (
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" fill="currentColor"/>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/DiaztMF',
      color: 'bg-[#24262a]',
      icon: (
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" fill="currentColor"/>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/diazt.mf/',
      color: 'bg-gradient-to-r from-[#405de6] via-[#5b51db] via-[#b33ab4] via-[#c135b4] via-[#e1306c] to-[#fd1f1f]',
      icon: (
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" fill="currentColor"/>
      )
    }
  ];

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto w-[80%]">
        <main className="flex flex-col lg:flex-row bg-white/5 rounded-2xl my-8 gap-8 p-8 lg:p-12">
          {/* Left Section */}
          <section className="w-full lg:w-1/2 space-y-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Get in Touch</h1>
              <p className="text-sm text-gray-300">
                Reach out, and let's build better ways to think and write<br className="hidden sm:block" />
                together.
              </p>
            </div>

            <div className="space-y-3">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-4">
                  <CheckIcon />
                  <p className="font-medium">{advantage}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start pt-8">
              <p className="text-xl font-bold mb-6">Find me on another platforms</p>
              <ul className="flex pl-10 gap-6 list-none">
                {socialLinks.map((social, index) => (
                  <li key={index} className="group relative">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-700 overflow-hidden transition-all duration-300 hover:text-white hover:shadow-lg"
                    >
                      <div className={`absolute bottom-0 left-0 w-full h-0 ${social.color} transition-all duration-300 group-hover:h-full`}></div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="relative z-10"
                      >
                        {social.icon}
                      </svg>
                    </a>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-top-14 transition-all duration-300 whitespace-nowrap">
                      {social.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Right Section */}
          <section className="w-full lg:w-1/2">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-3xl font-bold mb-2">Connect your thought</h2>
              <p className="text-sm text-gray-300">
                Let's align our notes! Reach out and let the magic of ideas<br className="hidden sm:block" />
                illuminate your mind.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/25 rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/25 rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full px-5 py-3 bg-white/5 border-2 border-white/25 rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all"
              />

              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-5 py-3 bg-white/5 border-2 border-white/25 rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Message"
                rows={5}
                required
                className="w-full px-5 py-3 bg-white/5 border-2 border-white/25 rounded-lg text-white placeholder-[#888888] focus:outline-none focus:bg-[#404040] focus:border-white/5 transition-all resize-y min-h-[120px]"
              ></textarea>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#3b8fee] to-[#6090e4] rounded-lg text-white text-lg font-normal transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full"
                  style={{
                    animation: `dotPulse 2s ease-in-out infinite ${i * 0.3}s`
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(0);
          }
        }
      `}</style>
    </div>
  );
};