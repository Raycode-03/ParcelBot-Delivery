"use client"
import React, { useState } from 'react'
import { Send } from 'lucide-react'
import Navbarorders from '@/components/order/navbarorders'
function HelpPage() {
  const [message, setMessage] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const faqs = [
    { 
      id: 1, 
      question: 'What is the return policy?',
      answer: 'Our return policy allows you to return items within 7 days of delivery if they are damaged, defective, or not as described. To initiate a return, please contact our support team with your order details and photos of the item. Refunds will be processed within 5-7 business days after we receive and inspect the returned item.'
    },
    { 
      id: 2, 
      question: 'What are the waybill options?',
      answer: 'We offer digital and physical waybill options. Digital waybills are sent to your email and can be accessed through your account dashboard. Physical waybills are attached to your package. You can track your delivery using the waybill number on our website or mobile app in real-time.'
    },
    { 
      id: 3, 
      question: 'What do I do if I fail to receive my order?',
      answer: 'If you haven\'t received your order within the expected delivery time, first check your tracking information for updates. Contact our customer support team immediately with your order number. We will investigate with our delivery partners and provide a resolution within 24-48 hours, including redelivery or a full refund if necessary.'
    },
    { 
      id: 4, 
      question: 'Where are you located?',
      answer: 'Parcelbot operates across major cities in Nigeria including Lagos, Abuja, Port Harcourt, Ibadan, and Kano. Our main headquarters is located in Lagos. We have distribution centers and pickup points in various locations within these cities for your convenience. You can find the nearest location to you on our website.'
    },
    { 
      id: 5, 
      question: 'Can the rider do multiple pickup?',
      answer: 'Yes! Our riders can handle multiple pickups in a single trip for efficiency. If you need to send parcels from different locations, you can schedule multiple pickups through your dashboard. Our system optimizes routes to ensure all your parcels are collected and delivered efficiently, saving you time and money.'
    },
    { 
      id: 6, 
      question: 'Can I make changes to an order I already placed',
      answer: 'You can make changes to your order before the rider picks it up. This includes updating the delivery address, receiver details, or package description. Log into your account, go to "Active Orders," and click "Edit" on the order you want to modify. Once a rider has picked up your package, changes are limited for security reasons.'
    }
  ];

  const handleSubmit = () => {
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbarorders/>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10">
  {/* LEFT COLUMN - Message Box */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 h-fit">
    <h2 className="text-xl font-medium text-gray-900 mb-6">
      Hi there, how can we help you?
    </h2>
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={5}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-4"
      />
      <div className="flex justify-start">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit message
        </button>
      </div>
    </div>
  </div>

  {/* RIGHT COLUMN - FAQ Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Questions Column */}
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Frequently asked questions.
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <button
            key={faq.id}
            onClick={() => setSelectedQuestion(index)}
            className={`w-full text-left px-5 py-4 rounded-lg transition-colors text-sm font-medium ${
              selectedQuestion === index
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {faq.question}
          </button>
        ))}
      </div>
    </div>

    {/* Answer Column */}
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Answer.</h3>
      <div className="bg-green-600 rounded-lg p-8 text-white">
        <p className="text-sm leading-relaxed">
          {faqs[selectedQuestion].answer}
        </p>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default HelpPage