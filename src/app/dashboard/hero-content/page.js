'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Eye, EyeOff, ArrowUpDown, Upload } from 'lucide-react'
import Image from 'next/image'

export default function HeroContent() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: { label: '', href: '' },
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    image: { src: '', alt: '' },
    order: 0,
    isActive: true
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch slides on mount
  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/hero?includeInactive=true')
      const result = await res.json()
      if (result.success) {
        setSlides(result.data)
      }
    } catch (err) {
      setError('Failed to fetch hero slides')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formDataForUpload = new FormData()
      formDataForUpload.append('file', file)
      formDataForUpload.append('folder', 'rayob/hero-slider')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataForUpload
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({
          ...prev,
          image: {
            ...prev.image,
            src: result.secure_url
          }
        }))
        setSuccess('Image uploaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
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
    if (!formData.title || !formData.subtitle || !formData.cta.label || !formData.cta.href) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const url = editingId ? `/api/hero/${editingId}` : '/api/hero'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (result.success) {
        setSuccess(editingId ? 'Slide updated successfully' : 'Slide created successfully')
        fetchSlides()
        resetForm()
        setShowForm(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('Failed to save slide')
      console.error(err)
    }
  }

  const handleEdit = (slide) => {
    setFormData(slide)
    setEditingId(slide._id)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return

    try {
      const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (result.success) {
        setSuccess('Slide deleted successfully')
        fetchSlides()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to delete slide')
      }
    } catch (err) {
      setError('Failed to delete slide')
      console.error(err)
    }
  }

  const handleToggleActive = async (slide) => {
    try {
      const res = await fetch(`/api/hero/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive })
      })

      const result = await res.json()
      if (result.success) {
        fetchSlides()
      }
    } catch (err) {
      setError('Failed to toggle slide visibility')
      console.error(err)
    }
  }

  const handleReorder = async (id, newOrder) => {
    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })

      const result = await res.json()
      if (result.success) {
        fetchSlides()
      }
    } catch (err) {
      setError('Failed to reorder slide')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      cta: { label: '', href: '' },
      bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      image: { src: '', alt: '' },
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
          <h1 className="text-3xl font-bold text-gray-900">Hero Slider Management</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm) }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> {showForm ? 'Cancel' : 'Add Slide'}
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
              {editingId ? 'Edit Slide' : 'Create New Slide'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Slide title"
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

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle *
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleFormChange}
                  placeholder="Slide subtitle/description"
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CTA Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA Button Label *
                  </label>
                  <input
                    type="text"
                    name="cta.label"
                    value={formData.cta.label}
                    onChange={handleFormChange}
                    placeholder="e.g., Join Now"
                    maxLength={50}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* CTA Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA Link *
                  </label>
                  <input
                    type="text"
                    name="cta.href"
                    value={formData.cta.href}
                    onChange={handleFormChange}
                    placeholder="e.g., /join-us"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background (Gradient or Color)
                </label>
                <input
                  type="text"
                  name="bg"
                  value={formData.bg}
                  onChange={handleFormChange}
                  placeholder="e.g., linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <label className="flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="flex items-center gap-2">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>

                {/* Or Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter Image URL
                  </label>
                  <input
                    type="text"
                    name="image.src"
                    value={formData.image.src}
                    onChange={handleFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use uploaded image or paste URL directly</p>
                </div>
              </div>

              {/* Image Preview */}
              {formData.image.src && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                  <img
                    src={formData.image.src}
                    alt={formData.image.alt || 'Slide preview'}
                    className="max-w-sm h-auto rounded-lg"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png'
                    }}
                  />
                </div>
              )}

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
                  Active (Show in hero slider)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingId ? 'Update Slide' : 'Create Slide'}
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

        {/* Slides List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">CTA</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading slides...
                    </td>
                  </tr>
                ) : slides.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No slides yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  slides.map((slide) => (
                    <tr key={slide._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleReorder(slide._id, Math.max(0, slide.order - 1))}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Move up"
                          >
                            <ArrowUpDown size={16} className="rotate-180" />
                          </button>
                          <span className="px-2">{slide.order}</span>
                          <button
                            onClick={() => handleReorder(slide._id, slide.order + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Move down"
                          >
                            <ArrowUpDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {slide.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {slide.cta.label}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleToggleActive(slide)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            slide.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {slide.isActive ? (
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
                          onClick={() => handleEdit(slide)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slide._id)}
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

        {/* Preview Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📝 About Hero Slider</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Slides are displayed in order from smallest to largest order number</li>
            <li>• Only active slides are shown on the homepage</li>
            <li>• Images are displayed on large screens (lg and up)</li>
            <li>• All changes are live immediately after saving</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
