'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

const iconOptions = [
  'FaBuilding',
  'FaHandshake',
  'FaBalanceScale',
  'FaFolderOpen',
  'FaGraduationCap',
  'FaGlobe',
  'FaHeart',
  'FaShieldAlt',
  'FaUsers',
  'FaBriefcase',
  'FaBook',
  'FaCross'
];

const colorOptions = [
  { name: 'Blue', value: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50' },
  { name: 'Red', value: 'from-red-500 to-red-600', lightBg: 'bg-red-50' },
  { name: 'Green', value: 'from-green-500 to-green-600', lightBg: 'bg-green-50' },
  { name: 'Purple', value: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50' },
  { name: 'Pink', value: 'from-pink-500 to-pink-600', lightBg: 'bg-pink-50' },
  { name: 'Amber', value: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-50' },
  { name: 'Teal', value: 'from-teal-500 to-teal-600', lightBg: 'bg-teal-50' },
  { name: 'Orange', value: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-50' },
];

const statColorOptions = ['blue', 'purple', 'green', 'red', 'orange', 'pink', 'teal'];

export default function MemberSupportContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editingStatIndex, setEditingStatIndex] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/membersupport')
      const result = await res.json()
      if (result.success && result.data) {
        setData(result.data)
      } else {
        // No data exists, create new empty structure
        setData({
          sectionTitle: '',
          sectionDescription: '',
          supportItems: [],
          ctaSection: { title: '', description: '', buttonLabel: '', buttonLink: '' },
          statsSection: [],
          isActive: true
        })
      }
    } catch (err) {
      setError('Failed to fetch member support content')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return
    
    setError('')
    setSaving(true)

    if (!data.sectionTitle || !data.sectionDescription || !data.supportItems || data.supportItems.length === 0) {
      setError('Please fill in all required fields')
      setSaving(false)
      return
    }

    try {
      const method = data._id ? 'PUT' : 'POST'
      const url = data._id ? `/api/membersupport/${data._id}` : '/api/membersupport'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (result.success) {
        setSuccess('Member support content saved successfully!')
        setData(result.data)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to save')
      }
    } catch (err) {
      setError('Failed to save member support content')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-600">No member support content found</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Member Support Content Management</h1>

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

      {/* Section Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={data.sectionTitle}
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Description
            </label>
            <textarea
              value={data.sectionDescription}
              onChange={(e) => setData({ ...data, sectionDescription: e.target.value })}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Support Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Support Items</h2>
          <button
            onClick={() => {
              setData({
                ...data,
                supportItems: [
                  ...data.supportItems,
                  {
                    title: '',
                    text: '',
                    iconName: 'FaBuilding',
                    color: 'from-blue-500 to-blue-600',
                    lightBg: 'bg-blue-50'
                  }
                ]
              })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Add Item
          </button>
        </div>

        <div className="space-y-4">
          {data.supportItems.map((item, idx) => (
            <div key={idx} className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...data.supportItems]
                      newItems[idx].title = e.target.value
                      setData({ ...data, supportItems: newItems })
                    }}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={item.iconName}
                    onChange={(e) => {
                      const newItems = [...data.supportItems]
                      newItems[idx].iconName = e.target.value
                      setData({ ...data, supportItems: newItems })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...data.supportItems]
                    newItems[idx].text = e.target.value
                    setData({ ...data, supportItems: newItems })
                  }}
                  maxLength={200}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={item.color}
                    onChange={(e) => {
                      const newItems = [...data.supportItems]
                      const colorObj = colorOptions.find(c => c.value === e.target.value)
                      newItems[idx].color = e.target.value
                      newItems[idx].lightBg = colorObj.lightBg
                      setData({ ...data, supportItems: newItems })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const newItems = data.supportItems.filter((_, i) => i !== idx)
                  setData({ ...data, supportItems: newItems })
                }}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete Item
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">CTA Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
            <input
              type="text"
              value={data.ctaSection?.title || ''}
              onChange={(e) => setData({
                ...data,
                ctaSection: { ...data.ctaSection, title: e.target.value }
              })}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
            <textarea
              value={data.ctaSection?.description || ''}
              onChange={(e) => setData({
                ...data,
                ctaSection: { ...data.ctaSection, description: e.target.value }
              })}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
              <input
                type="text"
                value={data.ctaSection?.buttonLabel || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { ...data.ctaSection, buttonLabel: e.target.value }
                })}
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                value={data.ctaSection?.buttonLink || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { ...data.ctaSection, buttonLink: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Stats Section</h2>
          <button
            onClick={() => {
              setData({
                ...data,
                statsSection: [
                  ...data.statsSection,
                  { number: '', title: '', description: '', color: 'blue' }
                ]
              })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Add Stat
          </button>
        </div>

        <div className="space-y-4">
          {data.statsSection.map((stat, idx) => (
            <div key={idx} className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number/Value</label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...data.statsSection]
                      newStats[idx].number = e.target.value
                      setData({ ...data, statsSection: newStats })
                    }}
                    maxLength={20}
                    placeholder="e.g., 7+"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={stat.title}
                    onChange={(e) => {
                      const newStats = [...data.statsSection]
                      newStats[idx].title = e.target.value
                      setData({ ...data, statsSection: newStats })
                    }}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={stat.color}
                    onChange={(e) => {
                      const newStats = [...data.statsSection]
                      newStats[idx].color = e.target.value
                      setData({ ...data, statsSection: newStats })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {statColorOptions.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={stat.description}
                  onChange={(e) => {
                    const newStats = [...data.statsSection]
                    newStats[idx].description = e.target.value
                    setData({ ...data, statsSection: newStats })
                  }}
                  maxLength={200}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  const newStats = data.statsSection.filter((_, i) => i !== idx)
                  setData({ ...data, statsSection: newStats })
                }}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete Stat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
        >
          <Save size={20} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
