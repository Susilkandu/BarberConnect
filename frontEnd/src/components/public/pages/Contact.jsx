import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Header Section with Parallax Background */}
      <div
        className="relative bg-[#1F2937] py-20 text-center text-white"
        style={{
          backgroundImage: "url('/images/contact-bg.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#1F2937]/80 py-20 px-4 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-[#E5E7EB]">
            Whether you have a question or want to book a chair — we're here for you.
          </p>
        </div>
      </div>

      {/* Contact Info & Form Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        {/* Contact Details */}
        <div className="bg-[#E5E7EB] p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-[#1F2937]">Contact Information</h2>
          <div className="space-y-4 text-[#111827]">
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-[#FFD369]" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#FFD369]" />
              <span>support@barberconnect.in</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-[#FFD369]" />
              <span>102, Barber Street, Lucknow, India</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-[#1F2937]">Send us a Message</h2>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-[#1F2937] hover:bg-[#FFD369] hover:text-[#111827] text-white py-3 rounded-md transition-colors duration-300 font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
