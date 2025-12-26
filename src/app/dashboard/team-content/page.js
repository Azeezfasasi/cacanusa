'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Upload } from 'lucide-react';

export default function TeamContentPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    photo: { url: '', alt: '' },
    bio: '',
    order: 0,
    isActive: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch team members
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team?includeInactive=true');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.data || []);
      } else {
        showMessage('error', 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);
      formDataForUpload.append('folder', 'cananusa/team');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataForUpload
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({
          ...formData,
          photo: {
            ...formData.photo,
            url: result.secure_url
          }
        });
        showMessage('success', 'Image uploaded successfully');
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('photo.')) {
      const photoField = name.split('.')[1];
      setFormData({
        ...formData,
        photo: {
          ...formData.photo,
          [photoField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleEditClick = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      position: member.position,
      photo: { url: member.photo?.url || '', alt: member.photo?.alt || '' },
      bio: member.bio || '',
      order: member.order || 0,
      isActive: member.isActive !== false
    });
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      position: '',
      photo: { url: '', alt: '' },
      bio: '',
      order: teamMembers.length,
      isActive: true
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.position.trim() || !formData.photo.url.trim()) {
      showMessage('error', 'Name, position, and photo URL are required');
      return;
    }

    try {
      setSaving(true);

      let response;
      if (editingId) {
        // Update existing
        response = await fetch(`/api/team/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create new
        response = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        const result = await response.json();
        showMessage('success', result.message || 'Team member saved successfully');
        setShowForm(false);
        await fetchTeamMembers();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to save team member');
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('success', 'Team member deleted successfully');
        await fetchTeamMembers();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', error.message);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newMembers = [...teamMembers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newMembers.length) return;

    // Swap order values
    const temp = newMembers[index].order;
    newMembers[index].order = newMembers[newIndex].order;
    newMembers[newIndex].order = temp;

    try {
      // Update both members
      const response1 = await fetch(`/api/team/${newMembers[index]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newMembers[index].order })
      });

      const response2 = await fetch(`/api/team/${newMembers[newIndex]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newMembers[newIndex].order })
      });

      if (response1.ok && response2.ok) {
        await fetchTeamMembers();
      } else {
        showMessage('error', 'Failed to reorder team members');
      }
    } catch (error) {
      console.error('Reorder error:', error);
      showMessage('error', error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading team members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Team Members</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} />
            Add Team Member
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter team member name"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.name.length}/100</p>
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g., Lead Developer"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.position.length}/150</p>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Upload Photo
                </label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <div className="flex items-center gap-2 flex-col sm:flex-row">
                      <Upload size={16} className="text-gray-500" />
                      <span className="text-xs sm:text-sm text-gray-600 text-center">
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
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>

              {/* Or Photo URL */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Or Enter Photo URL
                </label>
                <input
                  type="url"
                  name="photo.url"
                  value={formData.photo.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use uploaded image or paste URL directly</p>
              </div>

              {/* Photo Preview */}
              {formData.photo.url && (
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <img
                    src={formData.photo.url}
                    alt={formData.photo.alt || 'Team member'}
                    className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Photo Alt Text */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Photo Alt Text
                </label>
                <input
                  type="text"
                  name="photo.alt"
                  value={formData.photo.alt}
                  onChange={handleInputChange}
                  placeholder="Describe the photo for accessibility"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.photo.alt.length}/200</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Bio (optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Short biography"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="ml-2 text-xs sm:text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Team Members List */}
        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center border border-gray-200">
            <p className="text-gray-500 mb-4 text-sm">No team members yet</p>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Add First Team Member
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {teamMembers.map((member, index) => (
              <div key={member._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3">
                    {/* Photo */}
                    {member.photo?.url && (
                      <div className="flex justify-center">
                        <img
                          src={member.photo.url}
                          alt={member.photo.alt || member.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600 text-sm">{member.position}</p>
                      {member.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>}
                      <div className="flex justify-center mt-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Reorder Controls */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === teamMembers.length - 1}
                        className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditClick(member)}
                        className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-xs sm:text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id, member.name)}
                        className="w-full bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-xs sm:text-sm transition flex items-center gap-1 justify-center"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex gap-4">
                  {/* Photo */}
                  {member.photo?.url && (
                    <img
                      src={member.photo.url}
                      alt={member.photo.alt || member.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.position}</p>
                    {member.bio && <p className="text-sm text-gray-500 mt-2">{member.bio}</p>}
                    <div className="flex gap-3 mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditClick(member)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id, member.name)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm transition flex items-center gap-1 justify-center"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>

                  {/* Reorder */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === teamMembers.length - 1}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
