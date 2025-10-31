'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShareIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ShareIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Multi-Platform Poster
              </span>
            </div>
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Post to Multiple
            <span className="text-indigo-600"> Social Platforms</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Save time and reach more audiences by posting to Facebook, LinkedIn, and Twitter 
            with just one click. Connect your accounts and manage all your social media from one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-150"
            >
              Start Posting Now
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <ShareIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">One-Click Posting</h3>
              <p className="mt-2 text-base text-gray-500">
                Write once, post everywhere. Our platform automatically formats your content for each social media platform.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Multiple Platforms</h3>
              <p className="mt-2 text-base text-gray-500">
                Support for Facebook Pages, LinkedIn, and Twitter. More platforms coming soon!
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Secure & Reliable</h3>
              <p className="mt-2 text-base text-gray-500">
                Your social media accounts are connected securely using OAuth. We never store your passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Supported Platforms</h2>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-facebook rounded"></div>
              <span className="text-lg font-medium">Facebook</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linkedin rounded"></div>
              <span className="text-lg font-medium">LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-twitter rounded"></div>
              <span className="text-lg font-medium">Twitter</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
