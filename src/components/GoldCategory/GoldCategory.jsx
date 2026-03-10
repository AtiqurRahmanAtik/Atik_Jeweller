import React, { useEffect, useState } from 'react';
import { useGoldCategories } from '../../hooks/useGoldCategories'; // Adjust path
import { Trash2, Edit, Plus } from 'lucide-react';

const GoldCategory = () => {
    const { 
        goldCategories, 
        loading, 
        fetchGoldCategories, 
        createGoldCategory, 
        deleteGoldCategory 
    } = useGoldCategories();

    const [formData, setFormData] = useState({ categoryName: '', categoryImage: '' });

    useEffect(() => {
        fetchGoldCategories();
    }, [fetchGoldCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createGoldCategory(formData);
        if (success) {
            setFormData({ categoryName: '', categoryImage: '' });
            fetchGoldCategories(); // Refresh list
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteGoldCategory(id);
            fetchGoldCategories();
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary">Gold Category Management</h1>

            {/* Simple Create Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                    type="text"
                    placeholder="Category Name"
                    className="border p-2 rounded w-full"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                    required
                />
                <input 
                    type="text"
                    placeholder="Image URL"
                    className="border p-2 rounded w-full"
                    value={formData.categoryImage}
                    onChange={(e) => setFormData({...formData, categoryImage: e.target.value})}
                    required
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-opacity-90">
                    <Plus size={18} /> Add Category
                </button>
            </form>

            {/* Data Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 border-b">Image</th>
                            <th className="p-4 border-b">Category Name</th>
                            <th className="p-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center p-10">Loading...</td></tr>
                        ) : (
                            goldCategories.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 border-b">
                                        <img src={item.categoryImage} alt="" className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="p-4 border-b font-semibold">{item.categoryName}</td>
                                    <td className="p-4 border-b text-center">
                                        <div className="flex justify-center gap-3">
                                            <button className="text-blue-500 hover:text-blue-700"><Edit size={18}/></button>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GoldCategory;