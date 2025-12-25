'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Eye, EyeOff, ArrowUpDown } from 'lucide-react'

export default function WelcomeCTA() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    image: { src: '', alt: '' },
    button: { label: '', href: '' },
    order: 0,
    isActive: true
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch sections on mount
  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/welcome?includeInactive=true')
      const result = await res.json()
      if (result.success) {
        setSections(result.data)
      }
    } catch (err) {
      setError('Failed to fetch welcome sections')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (name === 'order' ? Number(value) : value)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.title || !formData.description1 || !formData.button.label || !formData.button.href) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const url = editingId ? `/api/welcome/${editingId}` : '/api/welcome'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (result.success) {
        setSuccess(editingId ? 'Section updated successfully' : 'Section created successfully')
        fetchSections()
        resetForm()
        setShowForm(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('Failed to save section')
      console.error(err)
    }
  }

  const handleEdit = (section) => {
    setFormData(section)
    setEditingId(section._id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const res = await fetch(`/api/welcome/${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (result.success) {
        setSuccess('Section deleted successfully')
        fetchSections()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to delete section')
      }
    } catch (err) {
      setError('Failed to delete section')
      console.error(err)
    }
  }

  const handleToggleActive = async (section) => {
    try {
      const res = await fetch(`/api/welcome/${section._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !section.isActive })
      })

      const result = await res.json()
      if (result.success) {
        fetchSections()
      }
    } catch (err) {
      setError('Failed to toggle section visibility')
      console.error(err)
    }
  }

  const handleReorder = async (id, newOrder) => {
    try {
      const res = await fetch(`/api/welcome/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })

      const result = await res.json()
      if (result.success) {
        fetchSections()
      }
    } catch (err) {
      setError('Failed to reorder section')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description1: '',
      description2: '',
      image: { src: '', alt: '' },
      button: { label: '', href: '' },
      order: 0,
      isActive: true
    })
    setEditingId(null)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome/About Section Management</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm) }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> {showForm ? 'Cancel' : 'Add Section'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Section' : 'Create New Section'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., About CANAN USA"
                    maxLength={200}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleFormChange}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Paragraph *
                </label>
                <textarea
                  name="description1"
                  value={formData.description1}
                  onChange={handleFormChange}
                  placeholder="First paragraph of your content"
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Paragraph (Optional)
                </label>
                <textarea
                  name="description2"
                  value={formData.description2}
                  onChange={handleFormChange}
                  placeholder="Second paragraph of your content (optional)"
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image.src"
                    value={formData.image.src}
                    onChange={handleFormChange}
                    placeholder="e.g., /images/about.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Image Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    name="image.alt"
                    value={formData.image.alt}
                    onChange={handleFormChange}
                    placeholder="Describe the image"
                    maxLength={200}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Button Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Label *
                  </label>
                  <input
                    type="text"
                    name="button.label"
                    value={formData.button.label}
                    onChange={handleFormChange}
                    placeholder="e.g., Learn More"
                    maxLength={50}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link *
                  </label>
                  <input
                    type="text"
                    name="button.href"
                    value={formData.button.href}
                    onChange={handleFormChange}
                    placeholder="e.g., /about-us"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active (Show on homepage)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingId ? 'Update Section' : 'Create Section'}
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false) }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sections List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Button</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading sections...
                    </td>
                  </tr>
                ) : sections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No sections yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  sections.map((section) => (
                    <tr key={section._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleReorder(section._id, Math.max(0, section.order - 1))}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Move up"
                          >
                            <ArrowUpDown size={16} className="rotate-180" />
                          </button>
                          <span className="px-2">{section.order}</span>
                          <button
                            onClick={() => handleReorder(section._id, section.order + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Move down"
                          >
                            <ArrowUpDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {section.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {section.button.label}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleToggleActive(section)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            section.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {section.isActive ? (
                            <>
                              <Eye size={14} /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(section)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(section._id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📝 About Welcome/About Sections</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sections are displayed in order from smallest to largest order number</li>
            <li>• Only active sections are shown on the homepage</li>
            <li>• You can add multiple sections for different about content</li>
            <li>• All changes are live immediately after saving</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
