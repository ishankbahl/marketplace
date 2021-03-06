import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if(this.state.error) {
            return (
                <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                  <div className="max-w-max mx-auto">
                    <main className="sm:flex">
                      <div className="sm:ml-6">
                        <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Something went wrong</h1>
                          <p className="mt-1 text-base text-gray-500">Please contact us, if the problem persists</p>
                        </div>
                        <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                          <a
                            href="https://discord.gg/vYGUaPksUu"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Contact Us
                          </a>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              )
        }

        return this.props.children;
    }
}
  