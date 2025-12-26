'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Loader } from 'lucide-react';

export default function WhyChooseUsContent() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Fetch features
  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/whychooseus?includeInactive=true');
      const result = await response.json();
      if (result.success) {
        setFeatures(result.data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const url = editingId 
        ? `/api/whychooseus/${editingId}` 
        : '/api/whychooseus';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(editingId ? 'Feature updated successfully' : 'Feature created successfully');
        setFormData({ title: '', description: '' });
        setEditingId(null);
        await fetchFeatures();
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Error saving feature');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature) => {
    setEditingId(feature._id);
    setFormData({
      title: feature.title,
      description: feature.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/whychooseus/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Feature deleted successfully');
        await fetchFeatures();
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Error deleting feature');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-0 md:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] md:text-3xl font-bold text-gray-900 mb-2">
            Why Choose Us - Content Management
          </h1>
          <p className="text-gray-600">
            Add, edit, or remove features displayed in the "Why Choose Us" section
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingId ? 'Edit Feature' : 'Add New Feature'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Feature Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={150}
                placeholder="e.g., Faith-Centered Community"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/150 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                placeholder="Enter a detailed description of this feature..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {editingId ? 'Update Feature' : 'Add Feature'}
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Features ({features.length})
          </h2>
          
          {loading && features.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} className="animate-spin text-blue-600" />
            </div>
          ) : features.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No features added yet. Create your first feature above!
            </p>
          ) : (
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(feature)}
                        disabled={loading}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(feature._id)}
                        disabled={loading}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>Status: <span className={`font-medium ${feature.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {feature.isActive ? 'Active' : 'Inactive'}
                    </span></span>
                    <span>Order: {feature.order}</span>
                    {feature.createdBy && <span>Created by: {feature.createdBy}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
