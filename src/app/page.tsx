// pages/index.tsx

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>FleetFlow - Your Reliable Logistics Partner</title>
        <meta
          name="description"
          content="FleetFlow connects users with reliable drivers for seamless transportation services. Experience real-time tracking, secure payments, and exceptional customer support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add any additional meta tags as needed */}
      </Head>

      <main className="font-sans">
        {/* Hero Section */}
        <section className=" bg-black text-white">
          <div className="container mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center">
            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Seamless Logistics for a Connected World
              </h1>
              <p className="text-lg mb-6">
                FleetFlow revolutionizes the way you connect with drivers and manage your transportation needs. Whether you&apos;re booking a ride or managing your fleet, FleetFlow ensures reliability, efficiency, and real-time visibility.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
                <Link
                  href="/features"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-indigo-600 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <Image
                src="/section_1_img.jpg" // Replace with your image path
                alt="FleetFlow Hero"
                width={500}
                height={500}
                className="mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-white container mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Vision</h2>
            <p className="text-lg text-gray-700">
              At FleetFlow, our vision is to create a world where transportation is effortless, reliable, and accessible to everyone. We strive to bridge the gap between users and drivers through innovative technology, ensuring that every journey is smooth and stress-free.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-100">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-indigo-600">Why Choose FleetFlow?</h2>
              <p className="text-lg text-gray-700 mt-4">
                Discover the features that set FleetFlow apart from the competition.
              </p>
            </div>
            <div className="flex flex-wrap -mx-4">
              {/* Feature 1 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/real_time_tracking.png" // Replace with your icon path
                      alt="Real-Time Tracking"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                  <p className="text-gray-600">
                    Monitor your driver&apos;s location in real-time, ensuring transparency and peace of mind every step of the way.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/secure_payment.png" // Replace with your icon path
                      alt="Secure Payments"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                  <p className="text-gray-600">
                    Enjoy secure and flexible payment options, including immediate and deferred payments, tailored to your needs.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/24_7.jpg" // Replace with your icon path
                      alt="24/7 Support"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Our dedicated support team is available around the clock to assist you with any queries or issues.
                  </p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/user_friendly.png" // Replace with your icon path
                      alt="User-Friendly Interface"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
                  <p className="text-gray-600">
                    Navigate our intuitive platform with ease, making booking and managing rides simpler than ever.
                  </p>
                </div>
              </div>
              {/* Feature 5 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/driver_verify.png" // Replace with your icon path
                      alt="Driver Verification"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Driver Verification</h3>
                  <p className="text-gray-600">
                    Trust our verified drivers who are thoroughly screened to provide you with safe and reliable transportation.
                  </p>
                </div>
              </div>
              {/* Feature 6 */}
              <div className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <Image
                      src="/flexibility.png" // Replace with your icon path
                      alt="Flexible Booking"
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
                  <p className="text-gray-600">
                    Book rides instantly or schedule them for a future date, providing you with the flexibility you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-600">What Our Users Say</h2>
            <p className="text-lg text-gray-700 mt-4">
              Hear from our satisfied customers and drivers who have transformed their transportation experience with FleetFlow.
            </p>
          </div>  
          <div className="flex flex-wrap -mx-4">
            {/* Testimonial 1 */}
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  &quot;FleetFlow has made booking rides so effortless. The real-time tracking feature gives me complete peace of mind.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/user.png" 
                    alt="User 1"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">Sarah L.</h4>
                    <p className="text-sm text-gray-500">New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  &quot;As a driver, FleetFlow has streamlined my workflow. The platform is reliable and the support team is always responsive.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/user.png" 
                    alt="Driver 1"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">Mike D.</h4>
                    <p className="text-sm text-gray-500">Los Angeles, USA</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  &quot;The payment system in FleetFlow is secure and flexible. I love having the option to pay later for my bookings.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/user.png" 
                    alt="User 2"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">Emily R.</h4>
                    <p className="text-sm text-gray-500">London, UK</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Add more testimonials as needed */}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-indigo-600 text-white">
          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Join FleetFlow Today!</h2>
            <p className="text-lg mb-8">
              Whether you&apos;re a user seeking reliable transportation or a driver looking for flexible earning opportunities, FleetFlow is your trusted partner.
            </p>
            <div className="flex justify-center space-x-4 flex-wrap">
              <Link
                href="/register"
                className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Sign Up as User
              </Link>
              <Link
                href="/driver/register"
                className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-indigo-600 transition"
              >
                Sign Up as Driver
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-200">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold">FleetFlow</h3>
              <p className="text-sm">&copy; {new Date().getFullYear()} FleetFlow. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy-policy">
                <p className="hover:text-white transition">Privacy Policy</p>
              </Link>
              <Link href="/terms-of-service">
                <p className="hover:text-white transition">Terms of Service</p>
              </Link>
              <Link href="/contact">
                <p className="hover:text-white transition">Contact Us</p>
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
