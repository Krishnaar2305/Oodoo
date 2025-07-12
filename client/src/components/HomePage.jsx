import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-4">SkillSwap</h1>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Connect. Learn. Share. Trade skills with people around the world.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-white text-blue-700 font-semibold px-6 py-2 rounded hover:bg-gray-100"
          >
            Get Started
          </Link>
          <Link
            to="/browse"
            className="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-blue-700"
          >
            Browse Skills
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why SkillSwap?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">Exchange Skills</h3>
            <p>Offer what you know and learn what you need — no money involved.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">Connect With People</h3>
            <p>Find users by availability, skill set, or location, and build lasting collaborations.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
            <p>Set your preferred days and times for sessions and connect when it suits you.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-white">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to skill swap?</h3>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
