'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Trash2, MessageSquare, CheckCircle, Clock, XCircle, Eye, Edit } from 'lucide-react';
import { Commet } from "react-loading-indicators";

export default function MemberRegRequest() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Fetch applications
  const fetchApplications = async (status = null, pageNum = 1) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (status && status !== 'all') query.append('status', status);
      query.append('page', String(pageNum));
      query.append('limit', '10');

      const response = await fetch(`/api/joinus?${query}`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/joinus/stats/overview');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchApplications(filter === 'all' ? null : filter, page);
    if (page === 1) fetchStats();
  }, [filter, page]);

  const handleStatusChange = async (appId, newStatus, notes = '') => {
    try {
      const response = await fetch(`/api/joinus/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Status updated successfully');
        fetchApplications(filter === 'all' ? null : filter, page);
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleSendReply = async (appId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      const response = await fetch(`/api/joinus/${appId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully');
        setReplyText('');
        setShowReplyModal(false);
        fetchApplications(filter === 'all' ? null : filter, page);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await fetch(`/api/joinus/${appId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Application deleted successfully');
        fetchApplications(filter === 'all' ? null : filter, page);
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'under-review':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0 md:pb-0 mx-auto">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-0 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Membership Applications</h1>

        {/* Statistics */}
        {stats && (
          <div className="w-full md:w-[80%] lg:w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-8 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-lg p-3 sm:p-5 md:p-0 lg:p-6 shadow hover:shadow-sm transition">
              <p className="text-gray-600 text-xs font-medium mb-1.5">Total Applications</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-5 md:p-6 shadow hover:shadow-sm transition">
              <p className="text-gray-600 text-xs font-medium mb-1.5">Pending</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-5 md:p-6 shadow hover:shadow-sm transition">
              <p className="text-gray-600 text-xs font-medium mb-1.5">Approved</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">{stats.byStatus.approved}</p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-5 md:p-6 shadow hover:shadow-sm transition">
              <p className="text-gray-600 text-xs font-medium mb-1.5">Rejected</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">{stats.byStatus.rejected}</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-4 sm:mb-5 md:mb-6 flex flex-wrap gap-2 sm:gap-2 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8">
          {['all', 'pending', 'under-review', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg capitalize transition text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                filter === status
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-900 hover:shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className='text-center'>
              <Commet color="#1e3a8a" size="medium" text="Loading" textColor="#ff0000" />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">No applications found</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Submitted</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-900">
                          {app.firstName} {app.lastName}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-600">{app.email}</td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm capitalize text-gray-600">
                          {app.membershipType}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-600">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 hover:bg-blue-100 rounded text-blue-600"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowReplyModal(true);
                            }}
                            className="p-2 hover:bg-green-100 rounded text-green-600"
                            title="Reply"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y">
                {applications.map(app => (
                  <div key={app._id} className="p-3 sm:p-4 border-b hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-0.5">{app.email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="hidden sm:inline capitalize">{app.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <p className="text-gray-600 font-medium mb-0.5">Type</p>
                        <p className="font-semibold text-gray-900 capitalize text-xs">{app.membershipType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-0.5">Submitted</p>
                        <p className="font-semibold text-gray-900 text-xs">
                          {new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="flex-1 px-2 sm:px-3 py-2 bg-blue-50 text-blue-600 rounded text-xs font-semibold hover:bg-blue-100 active:bg-blue-200 transition flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowReplyModal(true);
                        }}
                        className="flex-1 px-2 sm:px-3 py-2 bg-green-50 text-green-600 rounded text-xs font-semibold hover:bg-green-100 active:bg-green-200 transition flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="flex-1 px-2 sm:px-3 py-2 bg-red-50 text-red-600 rounded text-xs font-semibold hover:bg-red-100 active:bg-red-200 transition flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition text-xs sm:text-sm font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition text-xs sm:text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedApp && !showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white flex justify-between items-center gap-3">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold truncate">{selectedApp.firstName} {selectedApp.lastName}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0 transition"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm sm:text-base break-all">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-sm sm:text-base">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-sm sm:text-base">
                    {selectedApp.city}, {selectedApp.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Membership Type</p>
                  <p className="font-semibold text-sm sm:text-base capitalize">{selectedApp.membershipType}</p>
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.interests.map(interest => (
                    <span
                      key={interest}
                      className="bg-blue-100 text-blue-900 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Motivation</p>
                <p className="text-gray-900 text-sm sm:text-base leading-relaxed mt-2">{selectedApp.motivation}</p>
              </div>

              {selectedApp.adminNotes && (
                <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Admin Notes</p>
                  <p className="text-gray-900 text-sm sm:text-base leading-relaxed">{selectedApp.adminNotes}</p>
                </div>
              )}

              <div className="border-t pt-5 flex flex-col sm:flex-row gap-3">
                <select
                  onChange={e => {
                    handleStatusChange(selectedApp._id, e.target.value);
                    setSelectedApp(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="">Change Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 active:bg-blue-900 transition text-sm font-semibold"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto my-4 sm:my-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white flex justify-between items-center gap-3">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold truncate">Reply to {selectedApp.firstName}</h2>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0 transition"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm resize-none"
                rows="7"
              />
              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendReply(selectedApp._id)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 active:bg-blue-900 transition text-sm font-semibold"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
