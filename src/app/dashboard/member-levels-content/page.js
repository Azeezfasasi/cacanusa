'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'

const iconOptions = ['Users', 'Heart', 'Church', 'Zap', 'Crown', 'Star', 'Gift', 'Shield'];

const colorOptions = [
  { name: 'Blue', value: 'from-blue-500 to-blue-600' },
  { name: 'Red', value: 'from-red-500 to-pink-600' },
  { name: 'Purple', value: 'from-purple-500 to-purple-600' },
  { name: 'Yellow', value: 'from-yellow-500 to-orange-600' },
  { name: 'Amber', value: 'from-amber-600 to-yellow-600' },
  { name: 'Green', value: 'from-green-500 to-green-600' },
  { name: 'Teal', value: 'from-teal-500 to-teal-600' },
  { name: 'Orange', value: 'from-orange-500 to-orange-600' },
];

export default function MemberLevelsContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/membershiplevel')
      const result = await res.json()
      if (result.success && result.data) {
        setData(result.data)
      } else {
        // No data exists, create new empty structure
        setData({
          levels: [],
          benefits: [],
          ctaSection: {
            title: 'Ready to Make a Difference?',
            description: 'Join our growing community of advocates and champions dedicated to Christian protection globally.',
            primaryButton: { label: 'Choose Your Membership', link: '#membership' },
            secondaryButton: { label: 'Learn More', link: '#' }
          },
          isActive: true
        })
      }
    } catch (err) {
      setError('Failed to fetch membership levels')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return
    
    setError('')
    setSaving(true)

    if (!data.levels || data.levels.length === 0) {
      setError('Please add at least one membership level')
      setSaving(false)
      return
    }

    try {
      const method = data._id ? 'PUT' : 'POST'
      const url = data._id ? `/api/membershiplevel/${data._id}` : '/api/membershiplevel'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (result.success) {
        setSuccess('Membership levels saved successfully!')
        setData(result.data)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to save')
      }
    } catch (err) {
      setError('Failed to save membership levels')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6"><p className="text-gray-600">Loading...</p></div>
  }

  if (!data) {
    return <div className="p-6"><p className="text-gray-600">No data available</p></div>
  }

  return (
    <div className="p-0 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Membership Levels Management</h1>

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

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">CTA Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Label</label>
              <input
                type="text"
                value={data.ctaSection?.primaryButton?.label || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { 
                    ...data.ctaSection, 
                    primaryButton: { ...data.ctaSection.primaryButton, label: e.target.value }
                  }
                })}
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Link</label>
              <input
                type="text"
                value={data.ctaSection?.primaryButton?.link || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { 
                    ...data.ctaSection, 
                    primaryButton: { ...data.ctaSection.primaryButton, link: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Label</label>
              <input
                type="text"
                value={data.ctaSection?.secondaryButton?.label || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { 
                    ...data.ctaSection, 
                    secondaryButton: { ...data.ctaSection.secondaryButton, label: e.target.value }
                  }
                })}
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Link</label>
              <input
                type="text"
                value={data.ctaSection?.secondaryButton?.link || ''}
                onChange={(e) => setData({
                  ...data,
                  ctaSection: { 
                    ...data.ctaSection, 
                    secondaryButton: { ...data.ctaSection.secondaryButton, link: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
          <button
            onClick={() => {
              setData({
                ...data,
                benefits: [...(data.benefits || []), { text: '' }]
              })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Add Benefit
          </button>
        </div>

        <div className="space-y-4">
          {data.benefits?.map((benefit, idx) => (
            <div key={idx} className="flex gap-3">
              <input
                type="text"
                value={benefit.text}
                onChange={(e) => {
                  const newBenefits = [...data.benefits]
                  newBenefits[idx].text = e.target.value
                  setData({ ...data, benefits: newBenefits })
                }}
                maxLength={100}
                placeholder="Benefit text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newBenefits = data.benefits.filter((_, i) => i !== idx)
                  setData({ ...data, benefits: newBenefits })
                }}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Levels */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Membership Levels</h2>
          <button
            onClick={() => {
              const nextId = data.levels?.length ? Math.max(...data.levels.map(l => l.id)) + 1 : 1
              setData({
                ...data,
                levels: [
                  ...(data.levels || []),
                  {
                    id: nextId,
                    title: '',
                    description: '',
                    iconName: 'Users',
                    color: 'from-blue-500 to-blue-600',
                    badge: null,
                    highlighted: false
                  }
                ]
              })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Add Level
          </button>
        </div>

        <div className="space-y-6">
          {data.levels?.map((level, idx) => (
            <div key={idx} className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={level.title}
                    onChange={(e) => {
                      const newLevels = [...data.levels]
                      newLevels[idx].title = e.target.value
                      setData({ ...data, levels: newLevels })
                    }}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={level.iconName}
                    onChange={(e) => {
                      const newLevels = [...data.levels]
                      newLevels[idx].iconName = e.target.value
                      setData({ ...data, levels: newLevels })
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
                  value={level.description}
                  onChange={(e) => {
                    const newLevels = [...data.levels]
                    newLevels[idx].description = e.target.value
                    setData({ ...data, levels: newLevels })
                  }}
                  maxLength={200}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={level.color}
                    onChange={(e) => {
                      const newLevels = [...data.levels]
                      newLevels[idx].color = e.target.value
                      setData({ ...data, levels: newLevels })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={level.badge || ''}
                    onChange={(e) => {
                      const newLevels = [...data.levels]
                      newLevels[idx].badge = e.target.value || null
                      setData({ ...data, levels: newLevels })
                    }}
                    maxLength={20}
                    placeholder="e.g., Popular, Premium"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlighted</label>
                  <input
                    type="checkbox"
                    checked={level.highlighted}
                    onChange={(e) => {
                      const newLevels = [...data.levels]
                      newLevels[idx].highlighted = e.target.checked
                      setData({ ...data, levels: newLevels })
                    }}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const newLevels = data.levels.filter((_, i) => i !== idx)
                  setData({ ...data, levels: newLevels })
                }}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete Level
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
