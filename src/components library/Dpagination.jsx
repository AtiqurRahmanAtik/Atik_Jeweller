import  { useState, useEffect, useContext } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import UseAxiosSecure from '../Hook/UseAxioSecure';
import { AuthContext} from '../providers/AuthProvider';

const Dpagination = ({ url }) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalData, setTotalData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const axiosSecure = UseAxiosSecure();
  const { branch } = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, [currentPage, itemsPerPage, branch]);

    const fetchData = async () => {
        try {
            const fetchUrl = `${url}/branch/${branch}?itemsPerPage=${itemsPerPage}&pageNumber=${currentPage + 1}`;
            const response = await axiosSecure.get(fetchUrl);
            const data = response.data;
            setTotalData(data.data);
            setTotalItems(data.totalData);
            setNumberOfPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < numberOfPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPage = (e) => {
        const val = parseInt(e.target.value, 10);
        setItemsPerPage(val);
        setCurrentPage(0);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const ellipsis = (key) => <span key={key} className="px-3 py-2 text-gray-500">...</span>;
    
        switch (true) {
            case numberOfPages <= 5:
                for (let i = 0; i < numberOfPages; i++) {
                    pageNumbers.push(
                        <button
                            key={i}
                            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === i ? 'bg-yellow-500 rounded-xl text-white hover:bg-yellow-600' : 'bg-transparent hover:bg-gray-200'}`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    );
                }
                break;
    
            case currentPage <= 2:
                for (let i = 0; i < 3; i++) {
                    pageNumbers.push(
                        <button
                            key={i}
                            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === i ? 'bg-yellow-500 rounded-xl text-white hover:bg-yellow-600' : 'bg-transparent hover:bg-gray-200'}`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    );
                }
                pageNumbers.push(ellipsis('start-ellipsis'));
                pageNumbers.push(
                    <button
                        key={numberOfPages - 1}
                        className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === numberOfPages - 1 ? 'bg-gray-700 rounded-xl text-white hover:bg-gray-700' : 'bg-transparent hover:bg-gray-200'}`}
                        onClick={() => setCurrentPage(numberOfPages - 1)}
                    >
                        {numberOfPages}
                    </button>
                );
                break;
    
            case currentPage >= numberOfPages - 3:
                pageNumbers.push(
                    <button
                        key={0}
                        className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === 0 ? 'bg-gray-700 rounded-xl text-white hover:bg-gray-700' : 'bg-transparent hover:bg-gray-200'}`}
                        onClick={() => setCurrentPage(0)}
                    >
                        1
                    </button>
                );
                pageNumbers.push(ellipsis('end-ellipsis'));
                for (let i = numberOfPages - 3; i < numberOfPages; i++) {
                    pageNumbers.push(
                        <button
                            key={i}
                            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === i ? 'bg-yellow-500 rounded-xl text-white hover:bg-yellow-600' : 'bg-transparent hover:bg-gray-200'}`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    );
                }
                break;
    
            default:
                pageNumbers.push(
                    <button
                        key={0}
                        className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === 0 ? 'bg-gray-700 rounded-xl text-white hover:bg-gray-700' : 'bg-transparent hover:bg-gray-200'}`}
                        onClick={() => setCurrentPage(0)}
                    >
                        1
                    </button>
                );
                pageNumbers.push(ellipsis('middle-ellipsis'));
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(
                        <button
                            key={i}
                            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === i ? 'bg-yellow-500 rounded-xl text-white hover:bg-yellow-600' : 'bg-transparent hover:bg-gray-200'}`}
                            onClick={() => setCurrentPage(i)}
                        >
                            {i + 1}
                        </button>
                    );
                }
                pageNumbers.push(ellipsis('middle-ellipsis-2'));
                pageNumbers.push(
                    <button
                        key={numberOfPages - 1}
                        className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${currentPage === numberOfPages - 1 ? 'bg-gray-700 rounded-xl text-white hover:bg-gray-700' : 'bg-transparent hover:bg-gray-200'}`}
                        onClick={() => setCurrentPage(numberOfPages - 1)}
                    >
                        {numberOfPages}
                    </button>
                );
                break;
        }
    
        return pageNumbers;
    };

    const rowsPerPageAndTotal = (
        <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {totalItems} items</span>
            <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                    value={itemsPerPage}
                    className="bg-transparent outline-none text-default-400 text-small"
                    onChange={handleItemsPerPage}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </label>
        </div>
    );

    const paginationControls = (
        <div className='flex mt-3 items-center justify-between'>
            <div className="flex justify-end">
                <div className="m-2 shadow rounded-lg max-w-min flex">
                    <button
                        className="join-item px-3 py-2 text-white rounded focus:outline-none hover:bg-gray-200"
                        onClick={handlePrevPage}
                    >
                        <span className="text-black"><MdNavigateBefore /></span>
                    </button>
                    {renderPageNumbers()}
                    <button
                        className="px-3 py-2 text-white join-item rounded focus:outline-none hover:bg-gray-200"
                        onClick={handleNextPage}
                    >
                        <span className="text-black"><MdNavigateNext /></span>
                    </button>
                </div>
            </div>

            <div className='hidden md:block'>
                <div className='flex gap-2'>
                    <button
                        onClick={handlePrevPage}
                        className='text-xs bg-gray-100 px-4 rounded-md py-2 hover:bg-gray-50'
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        className='text-xs bg-gray-100 px-4 rounded-md py-2 hover:bg-gray-50'
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    return { paginatedData: totalData, paginationControls, rowsPerPageAndTotal ,fetchData  };
};

export default Dpagination;
