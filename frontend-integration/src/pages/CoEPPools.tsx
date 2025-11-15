import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CoEPPool, PoolFilters, PaginationParams } from '../types';
import { createCoEPService } from '../services/coepService';
import { useAuth } from '../auth/StacksAuthContext';
import styles from '../styles/pages/CoEPPools.module.css';

// Icons for different categories and statuses
import { 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaFilm,
  FaVideo,
  FaBookOpen,
  FaMusic,
  FaTv,
  FaUsers,
  FaClock,
  FaGlobe,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface CoEPPoolsProps {}

const CoEPPools: React.FC<CoEPPoolsProps> = () => {
  // Auth context
  const { userSession } = useAuth();
  const coepService = createCoEPService(userSession);

  // State management
  const [pools, setPools] = useState<CoEPPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<PoolFilters>({
    category: undefined,
    geographicFocus: undefined,
    status: undefined,
    hasSpace: undefined,
    search: undefined,
  });

  // Pagination configuration
  const [pageSize, setPageSize] = useState(12);

  // Fetch pools from service
  const fetchPools = async () => {
    try {
      setLoading(true);
      setError(null);

      const pagination: PaginationParams = {
        page: currentPage,
        limit: pageSize,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const result = await coepService.getPools(filters, pagination);

      if (result.success && result.data) {
        setPools(result.data.items);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || 'Failed to fetch pools');
        setPools([]);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching pools');
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch pools when filters or pagination change
  useEffect(() => {
    fetchPools();
  }, [currentPage, pageSize, filters]);

  // Filter pools by search term
  const filteredPools = useMemo(() => {
    if (!searchTerm.trim()) return pools;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return pools.filter(pool => 
      pool.name.toLowerCase().includes(lowerSearchTerm) ||
      pool.description.toLowerCase().includes(lowerSearchTerm) ||
      pool.creator.toLowerCase().includes(lowerSearchTerm)
    );
  }, [pools, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key: keyof PoolFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: undefined,
      geographicFocus: undefined,
      status: undefined,
      hasSpace: undefined,
      search: undefined,
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className={styles.poolsPage}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Co-EP Rotating Funding Pools</h1>
        <p className={styles.subtitle}>
          Collaborate with other filmmakers, build trust, and fund each other's projects through rotating savings pools.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.controls}>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search pools by name, creator, or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {/* Filter Toggle */}
        <button
          className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          Filters
        </button>

        {/* Results Summary */}
        <div className={styles.resultsSummary}>
          {loading ? (
            'Loading pools...'
          ) : (
            `${filteredPools.length} pool${filteredPools.length !== 1 ? 's' : ''} found`
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterRow}>
            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label>Category</label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                <option value="feature">Feature Films</option>
                <option value="short-film">Short Films</option>
                <option value="documentary">Documentaries</option>
                <option value="music-video">Music Videos</option>
                <option value="web-series">Web Series</option>
              </select>
            </div>

            {/* Geographic Focus Filter */}
            <div className={styles.filterGroup}>
              <label>Geographic Focus</label>
              <select
                value={filters.geographicFocus || 'all'}
                onChange={(e) => handleFilterChange('geographicFocus', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Regions</option>
                <option value="global">Global</option>
                <option value="hollywood">Hollywood</option>
                <option value="bollywood">Bollywood</option>
                <option value="nollywood">Nollywood</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className={styles.filterGroup}>
              <label>Pool Status</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Statuses</option>
                <option value="forming">Forming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className={styles.clearFiltersButton}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading pools...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchPools} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPools.length === 0 && (
        <div className={styles.emptyState}>
          <FaUsers className={styles.emptyIcon} />
          <h3>No pools found</h3>
          <p>
            {searchTerm || Object.values(filters).some(f => f !== undefined)
              ? 'Try adjusting your search or filters to find more pools.'
              : 'No Co-EP pools are currently available. Be the first to create one!'}
          </p>
          {(searchTerm || Object.values(filters).some(f => f !== undefined)) && (
            <button onClick={clearFilters} className={styles.clearFiltersButton}>
              Clear Search & Filters
            </button>
          )}
        </div>
      )}

      {/* Pools Grid */}
      {!loading && !error && filteredPools.length > 0 && (
        <>
          <div className={styles.poolsGrid}>
            {filteredPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                <span>Page {currentPage} of {totalPages}</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className={styles.pageSizeSelect}
                >
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>

              <div className={styles.paginationControls}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  <FaChevronLeft />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`${styles.pageNumber} ${
                          currentPage === pageNum ? styles.active : ''
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Social Trust Section */}
      <div className={styles.socialTrust}>
        <h2>Social Trust & Endorsements</h2>
        <p>Build your reputation by collaborating on projects and receiving endorsements from other filmmakers.</p>
        <ul>
          <li>Endorsements and mutual projects increase your pool reputation.</li>
          <li>Verified members are prioritized for funding rounds.</li>
        </ul>
      </div>
    </div>
  );
};

// Pool Card Component
interface PoolCardProps {
  pool: CoEPPool;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const navigate = useNavigate();
  
  const getCategoryIcon = (category: CoEPPool['category']) => {
    switch (category) {
      case 'feature': return <FaFilm />;
      case 'short-film': return <FaVideo />;
      case 'documentary': return <FaBookOpen />;
      case 'music-video': return <FaMusic />;
      case 'web-series': return <FaTv />;
      default: return <FaFilm />;
    }
  };

  const getStatusClass = (status: CoEPPool['status']) => {
    switch (status) {
      case 'forming': return styles.statusForming;
      case 'active': return styles.statusActive;
      case 'completed': return styles.statusCompleted;
      case 'paused': return styles.statusPaused;
      default: return '';
    }
  };

  const getGeographicIcon = (geo: CoEPPool['geographicFocus']) => {
    return geo === 'global' ? <FaGlobe /> : <FaMapMarkerAlt />;
  };

  const formatContribution = (amount: string) => {
    const stx = parseFloat(amount) / 1000000; // Convert microSTX to STX
    return `${stx.toLocaleString()} STX`;
  };

  const formatGeographicFocus = (geo: CoEPPool['geographicFocus']) => {
    return geo.charAt(0).toUpperCase() + geo.slice(1);
  };

  const formatCategory = (category: CoEPPool['category']) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={styles.poolCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge}>
          {getCategoryIcon(pool.category)}
          <span>{formatCategory(pool.category)}</span>
        </div>
        <div className={`${styles.statusBadge} ${getStatusClass(pool.status)}`}>
          {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.poolName}>{pool.name}</h3>
        <p className={styles.poolDescription}>{pool.description}</p>

        {/* Pool Stats */}
        <div className={styles.poolStats}>
          <div className={styles.statItem}>
            <FaUsers className={styles.statIcon} />
            <span className={styles.statLabel}>Members</span>
            <span className={styles.statValue}>
              {pool.currentMembers}/{pool.maxMembers}
            </span>
          </div>

          <div className={styles.statItem}>
            <FaClock className={styles.statIcon} />
            <span className={styles.statLabel}>Rotation</span>
            <span className={styles.statValue}>
              {pool.currentRotation}/{pool.totalRotations}
            </span>
          </div>

          <div className={styles.statItem}>
            {getGeographicIcon(pool.geographicFocus)}
            <span className={styles.statLabel}>Focus</span>
            <span className={styles.statValue}>
              {formatGeographicFocus(pool.geographicFocus)}
            </span>
          </div>
        </div>

        {/* Contribution Amount */}
        <div className={styles.contributionAmount}>
          <strong>{formatContribution(pool.contributionAmount)}</strong>
          <span className={styles.contributionLabel}>per rotation</span>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>
            <span>Pool Progress</span>
            <span>{Math.round((pool.currentMembers / pool.maxMembers) * 100)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(pool.currentMembers / pool.maxMembers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <button 
          className={`${styles.actionButton} ${
            pool.status === 'forming' ? styles.primary : styles.secondary
          }`}
          disabled={pool.status === 'completed' || pool.currentMembers >= pool.maxMembers}
          onClick={() => navigate(`/pool-detail/${pool.id}`)}
        >
          {pool.status === 'forming' && pool.currentMembers < pool.maxMembers 
            ? 'Join Pool' 
            : pool.status === 'active' 
            ? 'View Details' 
            : pool.status === 'completed'
            ? 'View Results'
            : 'Pool Full'}
        </button>
        
        <button 
          className={styles.detailsButton}
          onClick={() => navigate(`/pool-detail/${pool.id}`)}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CoEPPools;
