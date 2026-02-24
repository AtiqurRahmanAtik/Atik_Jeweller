

const Error404 = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-slate-950 px-6">
            <div className="max-w-md w-full text-center">
                {/* Visual Element: A subtle icon or illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <h1 className="text-9xl font-extrabold text-slate-200 dark:text-slate-800 tracking-tighter">
                            404
                        </h1>
                        <p className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-slate-800 dark:text-white mt-4">
                            Lost at Sea?
                        </p>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Room Not Found
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    It looks like the page you’re looking for has checked out. 
                    Let’s get your Hotelverse experience back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="/" 
                        className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Return to Dashboard
                    </a>
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-8 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                    >
                        Go Back
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-400">
                        Need assistance? <a href="/support" className="text-indigo-500 hover:underline">Contact Hotelverse Concierge</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Error404;