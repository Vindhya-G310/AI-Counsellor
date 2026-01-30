'use client';

import React, { useState, useEffect } from 'react';
import { universitiesAPI } from '../services/api';

export const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState({
    country: '',
    minBudget: '',
    maxBudget: '',
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [universities, filters, selectedCategory]);

  const fetchUniversities = async () => {
    try {
      const response = await universitiesAPI.getAll({});
      setUniversities(response.data);
    } catch (err) {
      console.error('Failed to fetch universities', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = universities;

    if (filters.country) {
      result = result.filter((u) => u.country === filters.country);
    }

    if (filters.minBudget) {
      result = result.filter((u) => u.avgCost >= Number(filters.minBudget));
    }

    if (filters.maxBudget) {
      result = result.filter((u) => u.avgCost <= Number(filters.maxBudget));
    }

    if (selectedCategory !== 'all') {
      result = result.filter((u) => u.category === selectedCategory);
    }

    setFilteredUniversities(result);
  };

  const handleShortlist = async (universityId, category) => {
    try {
      await universitiesAPI.shortlist(universityId, { category });
      fetchUniversities();
    } catch (err) {
      console.error('Failed to shortlist university', err);
    }
  };

  const handleRemoveShortlist = async (universityId) => {
    try {
      await universitiesAPI.removeFromShortlist(universityId);
      fetchUniversities();
    } catch (err) {
      console.error('Failed to remove from shortlist', err);
    }
  };

  const handleLock = async (universityId) => {
    try {
      await universitiesAPI.lock(universityId);
      fetchUniversities();
    } catch (err) {
      console.error('Failed to lock university', err);
    }
  };

  const countries = [...new Set(universities.map((u) => u.country))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading universities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">University Discovery</h1>
          <p className="text-gray-600">
            Explore and shortlist universities based on your preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold mb-4">Filters</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                  className="input"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Min Budget (USD)
                </label>
                <input
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) =>
                    setFilters({ ...filters, minBudget: e.target.value })
                  }
                  className="input"
                  placeholder="Min"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Max Budget (USD)
                </label>
                <input
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    setFilters({ ...filters, maxBudget: e.target.value })
                  }
                  className="input"
                  placeholder="Max"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Dream"
                      checked={selectedCategory === 'Dream'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>Dream</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Target"
                      checked={selectedCategory === 'Target'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>Target</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Safe"
                      checked={selectedCategory === 'Safe'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>Safe</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredUniversities.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600">No universities found</p>
                </div>
              ) : (
                filteredUniversities.map((uni) => (
                  <div key={uni._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{uni.name}</h3>
                        <p className="text-gray-600">{uni.country}</p>
                      </div>
                      {uni.ranking && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            #{uni.ranking}
                          </p>
                          <p className="text-sm text-gray-600">World Ranking</p>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4">{uni.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y">
                      <div>
                        <p className="text-sm text-gray-600">Avg Cost</p>
                        <p className="font-semibold">
                          ${(uni.avgCost / 1000).toFixed(0)}k/yr
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Min GPA</p>
                        <p className="font-semibold">{uni.minGPA}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Competitiveness</p>
                        <p className="font-semibold">{uni.competitiveness}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Degree Types</p>
                        <p className="font-semibold">
                          {uni.degreeTypes?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {uni.degreeTypes?.map((degree) => (
                        <span
                          key={degree}
                          className="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {degree}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {!uni.isShortlisted ? (
                        <>
                          <button
                            onClick={() =>
                              handleShortlist(uni._id, 'Dream')
                            }
                            className="btn text-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            Dream
                          </button>
                          <button
                            onClick={() =>
                              handleShortlist(uni._id, 'Target')
                            }
                            className="btn text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Target
                          </button>
                          <button
                            onClick={() => handleShortlist(uni._id, 'Safe')}
                            className="btn text-sm bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            Safe
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              uni.category === 'Dream'
                                ? 'bg-purple-100 text-purple-700'
                                : uni.category === 'Target'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {uni.category}
                          </span>
                          {!uni.isLocked && (
                            <>
                              <button
                                onClick={() => handleLock(uni._id)}
                                className="btn-primary text-sm"
                              >
                                Lock
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveShortlist(uni._id)
                                }
                                className="btn-danger text-sm"
                              >
                                Remove
                              </button>
                            </>
                          )}
                          {uni.isLocked && (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
                              🔒 Locked
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
