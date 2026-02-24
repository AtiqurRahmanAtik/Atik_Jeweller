import React from 'react';

const SkeletonLoader = () => {
    return (
        <div>
                <>
        {[...Array(10)].map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                        <div className="ml-4">
                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
            </tr>
        ))}
    </>
        </div>
    );
};

export default SkeletonLoader;