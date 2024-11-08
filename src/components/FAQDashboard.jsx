import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Plus, Edit, Trash } from 'lucide-react';
import { faqApi } from '../services/api';

const FAQDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editFAQ, setEditFAQ] = useState(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const data = await faqApi.getAllFAQs();
            setFaqs(data);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(data.map(faq => faq.category))];
            setCategories(uniqueCategories);

            setError(null);
        } catch (err) {
            setError('Failed to fetch FAQs. Please try again later.');
            console.error('Error fetching FAQs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFAQ = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await faqApi.deleteFAQ(id);
                setFaqs(faqs.filter(faq => faq.id !== id));
            } catch (err) {
                console.error('Error deleting FAQ:', err);
                alert('Failed to delete FAQ. Please try again.');
            }
        }
    };

   

const handleUpdateFAQ = async () => {
  if (!editFAQ) return;
  
  try {
    const updatedFAQ = await faqApi.updateFAQ(editFAQ.id, editFAQ);
    setFaqs(faqs.map(faq => faq.id === updatedFAQ.id ? updatedFAQ : faq));
    setEditFAQ(null);  // Close the modal
  } catch (err) {
    console.error('Error updating FAQ:', err);
    alert('Failed to update FAQ. Please try again.');
  }
};

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">University Computer Science FAQs</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* FAQ List */}
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading FAQs...</p>
                        </div>
                    ) : filteredFAQs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No FAQs found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFAQs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                        className="w-full p-4 flex justify-between items-start text-left"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                            <span className="text-sm text-gray-500">{faq.category}</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Open edit modal/form
                                                    setEditFAQ(faq);
                                                }}
                                                className="p-1 hover:bg-blue-100 rounded"
                                            >
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFAQ(faq.id);
                                                }}
                                                className="p-1 hover:bg-red-100 rounded"
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </button>
                                            {expandedFAQ === faq.id ? (
                                                <ChevronUp className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                            )}
                                        </div>
                                    </button>
                                    {expandedFAQ === faq.id && (
                                        <div className="px-4 pb-4">
                                            <p className="text-gray-700">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>

                                
                            ))}

        
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal - Moved outside the FAQ list */}
            {editFAQ && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit FAQ</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateFAQ();
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={editFAQ.question}
                                        onChange={(e) => setEditFAQ({...editFAQ, question: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Answer
                                    </label>
                                    <textarea
                                        value={editFAQ.answer}
                                        onChange={(e) => setEditFAQ({...editFAQ, answer: e.target.value})}
                                        rows={4}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={editFAQ.category}
                                        onChange={(e) => setEditFAQ({...editFAQ, category: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditFAQ(null)}
                                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );

    {/* Edit Modal */}
   
};



export default FAQDashboard;